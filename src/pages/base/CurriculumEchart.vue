<template>
  <div class="">
    <div :id="id" class="" :style="`height:${$store.state.sys_env=='pc'?'500':'420'}px;`"></div>
    <div v-if="current_sk_id > 0" class="fr mgr10" style="color: #54BFFF">点空白部分返回  </div>
  </div>
</template>
<script>
import api from "@/apis"
import "@/assets/js/ec1.js"
import "@/assets/js/d31.js"

export default {
  components: {},
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      id: String.random(10),
      current_sk_id: 0,
      colors: {
        'blue': ['#a1bbf7', '#064ff9'],
        'red': ['#f99fc3', '#e30d63'],
        'cyan': ['#b0dcf7', '#009dff'],
      },
      color: "red",
    }
  },
  methods: {
    flush(category) {
      var vm = this
      var dom = document.getElementById(vm.id);
      var myChart = echarts.init(dom);
      var option

      function run() {

        api.get(`/curriculums/echarts/${category}`, {
          data: {
          },
          success: function (data) {
            const dataWrap = prepareData(data.tree, data.rootname);
            initChart(dataWrap.seriesData, dataWrap.maxDepth);
          },
          error: function (code, msg, data) {
            // alert(`error(${code})`)
          },
          must: function (err) {
          }
        })
      }

      run()

      function prepareData(rawData, rootname) {
        const seriesData = [];
        let maxDepth = 0;
        let i = 0

        function convert(source, basePath, depth) {
          if (source == null) {
            return;
          }
          if (maxDepth > 5) {
            return;
          }
          maxDepth = Math.max(depth, maxDepth);
          i++
          seriesData.push({
            id: basePath,
            sk_id: source.$sk_id,
            value: source.$count,
            depth: depth,
            index: seriesData.length
          });
          for (var key in source) {
            if (source.hasOwnProperty(key) && !key.match(/^\$/)) {
              var path = basePath + '>' + key;
              convert(source[key], path, depth + 1);
            }
          }
        }

        convert(rawData, rootname, 0);
        console.log('i:', i)
        console.log('maxDepth:', maxDepth)
        return {
          seriesData: seriesData,
          maxDepth: maxDepth
        };
      }

      function initChart(seriesData, maxDepth) {
        var displayRoot = stratify();

        function stratify() {
          return d3
              .stratify()
              .parentId(function (d) {
                return d.id.substring(0, d.id.lastIndexOf('>'));
              })(seriesData)
              .sum(function (d) {
                return d.value || 0;
              })
              .sort(function (a, b) {
                return b.value - a.value;
              });
        }

        function overallLayout(params, ec_api) {
          var context = params.context;
          d3
              .pack()
              .size([ec_api.getWidth() - 2, ec_api.getHeight() - 2])
              .padding(3)(displayRoot);
          context.nodes = {};
          displayRoot.descendants().forEach(function (node, index) {
            context.nodes[node.id] = node;
          });
        }

        function renderItem(params, ec_api) {
          var context = params.context;
          // Only do that layout once in each time `setOption` called.
          if (!context.layout) {
            context.layout = true;
            overallLayout(params, ec_api);
          }
          var nodePath = ec_api.value('id');
          var node = context.nodes[nodePath];
          if (!node) {
            // Reder nothing.
            return;
          }
          var isLeaf = !node.children || !node.children.length;
          var focus = new Uint32Array(
              node.descendants().map(function (node) {
                return node.data.index;
              })
          );
          var nodeName = isLeaf
              ? nodePath
                  .slice(nodePath.lastIndexOf('>') + 1)
                  .split(/(?=[A-Z][^A-Z])/g)
                  .join('\n')
              : '';
          var z2 = ec_api.value('depth') * 2;
          return {
            type: 'circle',
            focus: focus,
            shape: {
              cx: node.x,
              cy: node.y,
              r: node.r
            },
            transition: ['shape'],
            z2: z2,
            textContent: {
              type: 'text',
              style: {
                // transition: isLeaf ? 'fontSize' : null,
                text: nodeName,
                fontFamily: 'Arial',
                width: node.r * 1.3,
                overflow: 'truncate',
                fontSize: node.r / 3
              },
              emphasis: {
                style: {
                  overflow: null,
                  fontSize: Math.max(node.r / 3, 12)
                }
              }
            },
            textConfig: {
              position: 'inside'
            },
            style: {
              fill: ec_api.visual('color')
            },
            emphasis: {
              style: {
                fontFamily: 'Arial',
                fontSize: 12,
                shadowBlur: 20,
                shadowOffsetX: 3,
                shadowOffsetY: 5,
                shadowColor: '#fff',//vm.data.colors[1]
              }
            }
          };
        }

        option = {
          dataset: {
            source: seriesData
          },
          tooltip: {
            backgroundColor: vm.data.colors[1],
            textStyle: {
              fontSize: 16,
              color: '#fff',
            },
            formatter: `{b}`,
          },
          visualMap: [
            {
              show: false,
              min: 0,
              max: maxDepth,
              dimension: 'depth',
              inRange: {
                color: vm.data.colors
              }
            }
          ],
          hoverLayerThreshold: Infinity,
          series: {
            type: 'custom',
            renderItem: renderItem,
            progressive: 0,
            coordinateSystem: 'none',
            encode: {
              tooltip: 'value',
              itemName: 'id'
            }
          }
        };
        myChart.setOption(option);
        myChart.on('click', {seriesIndex: 0}, function (params) {
          vm.current_sk_id = params.data.sk_id
          if(vm.data.click) vm.data.click(params.data)
          drillDown(params.data.id);
        });

        function drillDown(targetNodeId) {
          displayRoot = stratify();
          if (targetNodeId != null) {
            displayRoot = displayRoot.descendants().find(function (node) {
              return node.data.id === targetNodeId;
            });
          }
          // A trick to prevent d3-hierarchy from visiting parents in this algorithm.
          displayRoot.parent = null;
          myChart.setOption({
            dataset: {
              source: seriesData
            }
          });
        }

        // Reset: click on the blank area.
        myChart.getZr().on('click', function (event) {
          if (!event.target) {
            drillDown();
          }
        });
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }
    }
  },
  watch: {},
  mounted() {
    var vm = this
    vm.data.flush = vm.flush
    vm.flush(vm.data.data)
  }
}
</script>

<style lang="less" scoped>

</style>
