<template>
  <div class="main">
    <van-tabs>
      <van-tab title="基本信息">
        <div class="page">
          <van-field v-model="input" label="流转卡批号" placeholder="请输入内容" readonly class="readonly-input"
            label-class="readonly-label" disabled> </van-field>
          <van-field v-model="model" label="型号" placeholder="请输入型号" readonly class="readonly-input"
            label-class="readonly-label" disabled></van-field>
          <van-field v-model="processNo.name" label="工序号" placeholder="请输入工序号" label-class="readonly-label"
            @click="showprocessNoPopup = true" readonly></van-field>
          <van-popup v-model:show="showprocessNoPopup" position="bottom">
            <van-cell-group>
              <van-cell v-for="process in processNoList" :key="process.id" :title="process.name"
                @click="selectprocessNo(process)"></van-cell>
            </van-cell-group>
          </van-popup>
          <van-field v-model="processingCost" label="加工费" placeholder="请输入加工费" readonly class="readonly-input"
            label-class="readonly-label" disabled></van-field>
        </div>
      </van-tab>
      <van-tab title="" disabled></van-tab>
      <van-tab title="" disabled></van-tab>
      <van-tab title="" disabled></van-tab>
    </van-tabs>

    <van-tabs>
      <van-tab title="报工信息">
        <div class="page">
          <van-field v-model="reportUser.name" label="报工用户" placeholder="请输入报工用户" @click="showUserPopup = true" readonly>
            <template #label>
              <span>报工用户<span style="color: red;">*</span></span>
            </template>
          </van-field>
          <van-popup v-model:show="showUserPopup" position="bottom">
            <van-cell-group>
              <van-cell v-for="user in userList" :key="user.id" :title="user.name" @click="selectUser(user)"></van-cell>
            </van-cell-group>
          </van-popup>

          <van-field v-model="inputNum" type="number" label="投入数" placeholder="请输入投入数" @input="handleOutputNumBlur">
            <template #label>
              <span>投入数<span style="color: red;">*</span></span>
            </template>
          </van-field>
          <van-field v-model="outputNum" type="number" label="产出数" placeholder="请输入产出数" @input="handleOutputNumBlur">
            <template #label>
              <span>产出数<span style="color: red;">*</span></span>
            </template>
          </van-field>
        </div>
      </van-tab>
      <van-tab title="" disabled></van-tab>
      <van-tab title="" disabled></van-tab>
      <van-tab title="" disabled></van-tab>
    </van-tabs>

    <van-tabs>
      <van-tab title="不良信息">
        <div class="page">
          <!-- <van-field v-model="defectiveTotal" label="不良总数" placeholder="不良总数" disabled></van-field> -->
          <div class="defect-card" v-for="(item, index) in defectiveItems" :key="index">
            <van-row>
              <!-- <van-col span="20"> -->
              <van-field v-model="item.defectiveItem.name" :label="`不良项目${index + 1}`" placeholder="请选择不良项目" readonly
                @click="showDefectiveItems(index)">
                <template #button>
                  <van-button slot="button" size="small" type="danger"
                    @click.stop="deleteDefectiveItem(index)">删除</van-button>
                </template>
              </van-field>
              <!-- </van-col> -->
              <!-- <van-col span="4" align="center">
            <van-button class="delete-round-button" type="danger" @click="deleteDefectiveItem(index)">删除</van-button>
          </van-col> -->
            </van-row>
            <van-field v-model="item.defectiveNum" :label="`不良数${index + 1}`" type="number" placeholder="请输入不良数"
              @input="calculateDefectiveTotal"></van-field>
          </div>
          <van-popup v-model:show="showPopup" position="bottom">
            <van-cell-group>
              <van-cell v-for="item in defectiveItemList" :key="item.id" :title="item.name"
                @click="selectDefectiveItem(item)"></van-cell>
            </van-cell-group>
          </van-popup>
        </div>
      </van-tab>
      <van-tab title="" disabled></van-tab>
      <van-tab title="不良总数：" disabled></van-tab>
      <van-tab :title="defectiveTotal" disabled></van-tab>
    </van-tabs>
  </div>
  <div class="footer">
    <van-row>
      <van-col span="8"><van-button type="success" @click="addDefectiveItem">新增不良</van-button></van-col>
      <van-col span="8"></van-col>
      <van-col span="8"><van-button type="primary" @click="showConfirmDialog">提交报工</van-button></van-col>
    </van-row>
  </div>
</template>

<script>
import axios from 'axios';
//http://192.168.191.25:8080/ReportWork?fid=111121&xh=xh1&gxh=gxh1&bllx=cs1,cs2,cs34
export default {
  data() {
    return {
      types: {
        FfetchUserData: false,
        // FfetchdefectiveItemData: false,
        FfetchprocessNoData: false,
      },
      successCounter: 0,
      apiURL: 'http://192.168.1.24:8890',
      //apiURL: 'http://192.168.191.25:8890',
      input: 'OP000018',
      model: 'NTSA2B104F3999',
      processNo: '',
      inputNum: '',
      outputNum: '',
      defectiveTotal: '',
      reportUser: '',
      processingCost: '0',
      defectiveItems: [],
      showPopup: false,
      defectiveItemList: [
        {
          "id": "0001",
          "name": "不良项目1"
        },
        {
          "id": "0002",
          "name": "不良项目2"
        }
      ],
      userList: [
        {
          "id": "0001",
          "name": "用户1"
        },
        {
          "id": "0002",
          "name": "用户2"
        }
      ],
      processNoList: [
        {
          "id": "0001",
          "name": "工序1"
        },
        {
          "id": "0002",
          "name": "工序2"
        }
      ],
      showUserPopup: false,
      showprocessNoPopup: false,
      flag: 2, // 标识参数，0表示在投入数变化时动态计算加工费，1表示在产出数变化时动态计算加工费
      efficiency: 0, // 效率
      wageCoefficient: 0 // 工资系数
    };
  },
  created() {
    // 获取路由参数并解析
    if (Object.keys(this.$route.query).length > 0) {
      this.input = this.$route.query.fid;
      this.model = this.$route.query.xh;
      this.processingCost = this.$route.query.jgf;
    }

    if (this.input) {
      this.fetchUserData();
      // this.fetchdefectiveItemData();
      this.fetchprocessNoData();
    }
  },
  watch: {
    types: {
      deep: true,
      handler(newValue) {
        const isSuccess = Object.values(newValue).every(value => value === true);
        console.log(this.types)
        if (isSuccess && this.successCounter === 2) {
          this.processNo = this.processNoList[0];
          //调用获取加工费参数接口
          const dataJGF = {
            number: this.input,
            gxh: this.processNo.id,
          };
          // 创建一个 Axios 实例
          const api = axios.create({
            baseURL: this.apiURL, // 设置基本URL
            timeout: 10000, // 设置超时时间
          });
          //console.log(data); //打印数据
          // 发送 POST 请求
          api.post('/GetGF', dataJGF)
            .then(response => {
              if (response.data) {
                this.efficiency = response.data.gshsl; //效率
                this.wageCoefficient = response.data.gzxs; //工资系数
                this.flag = response.data.sf;  //判断标识
                //动态修改加工费
                if (this.flag === '0' && this.inputNum !== '') {
                  this.processingCost = (this.inputNum / this.efficiency * this.wageCoefficient).toFixed(2);
                } else if (this.flag === '1' && this.outputNum !== '') {
                  this.processingCost = (this.outputNum / this.efficiency * this.wageCoefficient).toFixed(2);
                }
              }
            })
            .catch(error => {
              console.error('加工费接口调用失败');
              console.error(error);
            })
        } else if (!isSuccess && this.successCounter === 2) {
          this.$dialog.alert({
            title: '提示',
            message: '接口调用失败，请重试',
            confirmButtonText: '确定'
          });
        }
      }
    }
  },
  methods: {
    fetchUserData() {
      // 创建一个 Axios 实例
      const api = axios.create({
        baseURL: this.apiURL, // 设置基本URL
        timeout: 5000, // 设置超时时间
      });
      // 发送 GET 请求
      api.get('/GetYh')
        .then(response => {
          // 请求成功的处理逻辑
          if (response.data && response.data.length > 0) {
            const users = response.data.map(item => ({ id: item.id, name: item.name }));
            this.userList = users;
            // this.reportUser = this.userList[0].name; // 默认选中第一个用户
            this.types.FfetchUserData = true;
            this.successCounter++;
          } else {
            this.types.FfetchUserData = false;
            this.successCounter++;
          }
        })
        .catch(error => {
          console.error('失败');
          console.error(error);
          this.types.FfetchUserData = false;
          this.successCounter++;
        });
    },
    fetchdefectiveItemData() {
      // 创建一个 Axios 实例
      const api = axios.create({
        baseURL: this.apiURL, // 设置基本URL
        timeout: 5000, // 设置超时时间
      });
      // 发送 GET 请求
      api.get('/GetBlp')
        .then(responsedefective => {
          // 请求成功的处理逻辑
          if (responsedefective.data && responsedefective.data.length > 0) {
            const Items = responsedefective.data.map(item => ({ id: item.id, name: item.name }));
            this.defectiveItemList = Items;
            this.types.FfetchdefectiveItemData = true;
            this.successCounter++;
          } else {
            this.types.FfetchdefectiveItemData = false;
            this.successCounter++;
          }
        })
        .catch(error => {
          console.error('失败');
          console.error(error);
          this.types.FfetchdefectiveItemData = false;
          this.successCounter++;
        });
    },
    fetchprocessNoData() {
      const dataF = {
        number: this.input
      };

      // 创建一个 Axios 实例
      const api = axios.create({
        baseURL: this.apiURL, // 设置基本URL
        timeout: 10000, // 设置超时时间
      });
      //console.log(data); //打印数据
      // 发送 POST 请求
      api.post('/GetGXH', dataF)
        .then(responseGXH => {
          if (responseGXH.data && responseGXH.data.length > 0) {
            const GXHItems = responseGXH.data.map(item => ({ id: item.id, name: item.name }));
            this.processNoList = GXHItems;
            // this.processNo = this.processNoList[0]; // 设置默认值为第一个工序号对象
            // this.showprocessNoPopup = false; // 关闭弹窗
            this.types.FfetchprocessNoData = true;
            this.successCounter++;
          } else {
            this.types.FfetchprocessNoData = false;
            this.successCounter++;
          }
        })
        .catch(error => {
          console.error('失败');
          console.error(error);
          this.types.FfetchprocessNoData = false;
          this.successCounter++;
        })
    },
    showDefectiveItems(index) {
      if (this.processNo.id) {
        const data = { number: this.input, gxh: this.processNo.id };
        // 创建一个 Axios 实例
        const api = axios.create({
          baseURL: this.apiURL, // 设置基本URL
          timeout: 10000, // 设置超时时间
        });
        //console.log(data); //打印数据
        // 发送 POST 请求
        api.post('/GetBlp', data)
          .then(response => {
            if (response.data.length > 0) {
              const Items = response.data.map(item => ({ id: item.id, name: item.name }));
              this.defectiveItemList = Items;
              this.showPopup = true;
              this.popupIndex = index;
            } else {
              this.$dialog.alert({
                title: '提示',
                message: '无法获取对应工序号的不良项目',
                confirmButtonText: '确定'
              });
            }
          })
          .catch(error => {
            console.error('失败');
            console.error(error);
            this.$dialog.alert({
              title: '提示',
              message: '接口调用失败，请重试',
              confirmButtonText: '确定'
            });
          });
      } else {
        this.$dialog.alert({
          title: '提示',
          message: '工序号不能为空',
          confirmButtonText: '确定'
        });
      }
    },
    selectDefectiveItem(item) {
      this.defectiveItems[this.popupIndex].defectiveItem = item;
      this.showPopup = false;
    },
    addDefectiveItem() {
      const index = this.defectiveItems.length;
      this.defectiveItems.push({ defectiveItem: '', defectiveNum: '' });
    },
    clearDefectiveItem() {
      if (this.defectiveItems.length > 0) {
        this.defectiveItems.pop();
      } else {
        alert('无可清除的不良项目');
      }
    },
    selectUser(user) {
      this.reportUser = user;
      this.showUserPopup = false;
    },
    selectprocessNo(process) {
      this.processNo = process;
      this.showprocessNoPopup = false;

      //调用获取加工费参数接口
      const dataJGF = {
        number: this.input,
        gxh: this.processNo.id,
      };

      // 创建一个 Axios 实例
      const api = axios.create({
        baseURL: this.apiURL, // 设置基本URL
        timeout: 10000, // 设置超时时间
      });
      //console.log(data); //打印数据
      // 发送 POST 请求
      api.post('/GetGF', dataJGF)
        .then(response => {
          if (response.data) {
            this.efficiency = response.data.gshsl; //效率
            this.wageCoefficient = response.data.gzxs; //工资系数
            this.flag = response.data.sf;  //判断标识
            //动态修改加工费
            if (this.flag === '0' && this.inputNum !== '') {
              this.processingCost = (this.inputNum / this.efficiency * this.wageCoefficient).toFixed(2);
            } else if (this.flag === '1' && this.outputNum !== '') {
              this.processingCost = (this.outputNum / this.efficiency * this.wageCoefficient).toFixed(2);
            }
          }
        })
        .catch(error => {
          console.error('加工费接口调用失败');
          console.error(error);
        })
    },
    clear() {
      // this.input = '';
      // this.model = '';
      this.processNo = '';
      this.inputNum = '';
      this.outputNum = '';
      this.defectiveTotal = '';
      this.reportUser = '';
      // this.processingCost = '';
      this.defectiveItems = [];
    },
    confirm() {
      // 确认逻辑
    },
    removeDefectiveItem(index) {
      this.defectiveItems.splice(index, 1);
    },
    handleOutputNumBlur() {
      this.outputNum = Number(this.outputNum);
      this.inputNum = Number(this.inputNum);
      if (this.outputNum > this.inputNum) {
        this.outputNum = this.inputNum;
      }
      let totalDefects = 0;
      this.defectiveItems.forEach(item => {
        if (item.defectiveNum) {
          totalDefects += Number(item.defectiveNum);
        }
      });
      this.defectiveTotal = `${totalDefects}/${this.inputNum - this.outputNum}`;

      //动态修改加工费
      if (this.flag === '0' && this.inputNum !== '') {
        this.processingCost = (this.inputNum / this.efficiency * this.wageCoefficient).toFixed(2);
      } else if (this.flag === '1' && this.outputNum !== '') {
        this.processingCost = (this.outputNum / this.efficiency * this.wageCoefficient).toFixed(2);
      }
    },
    showConfirmDialog() {
      this.$dialog.confirm({
        message: '确定要提交吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 用户点击了确定按钮
        if (this.validateForm()) {
          this.submitData();
        }
      }).catch(() => {
        // 用户点击了取消按钮
      });
    },
    calculateDefectiveTotal() {
      let totalDefects = 0;
      this.defectiveItems.forEach(item => {
        if (item.defectiveNum) {
          totalDefects += Number(item.defectiveNum);
        }
      });
      const inputNum = this.inputNum ? Number(this.inputNum) : 0;
      const outputNum = this.outputNum ? Number(this.outputNum) : 0;
      this.defectiveTotal = `${totalDefects}/${inputNum - outputNum}`;
    },
    deleteDefectiveItem(index) {
      this.defectiveItems.splice(index, 1);
    },
    submitData() {
      // 显示加载状态
      this.$toast.loading({
        duration: 0, // 持续显示，直到手动关闭
        message: '提交中...'
      });
      // 获取所有控件的值，整合成 JSON 对象
      const data = {
        GxJhNumber: this.input,
        model: this.model,
        GXH: this.processNo.id,
        inputNum: this.inputNum,
        FQuaQty: this.outputNum,
        FProcessFailQty: Number(this.inputNum) - Number(this.outputNum),
        FStaffNumber: this.reportUser.id,
        processingCost: this.processingCost,
        FSubEntity: this.defectiveItems.map(item => ({
          FOperDefectQty: item.defectiveNum,
          FDefectReasonId: {
            FNUMBER: item.defectiveItem.id
          }
        }))
      };

      // 创建一个 Axios 实例
      const api = axios.create({
        baseURL: this.apiURL, // 设置基本URL
        timeout: 20000, // 设置超时时间
      });

      // 发送 POST 请求
      api.post('/BYtest', data)
        .then(response => {
          // 请求成功的处理逻辑
          console.log(response); //打印数据
          if (response.data.status === "200") {
            // 弹窗提示报工成功
            this.$dialog.alert({
              title: '提示',
              message: '报工成功',
              confirmButtonText: '确定'
            });
          } else {
            // 弹窗提示报工失败，请重试
            this.$dialog.alert({
              title: '提示',
              message: '报工失败，请重试',
              confirmButtonText: '确定'
            });
          }
        })
        .catch(error => {
          // // 请求失败的处理逻辑
          // 弹窗提示报工失败，请重试
          this.$dialog.alert({
            title: '提示',
            message: '报工失败，请重试',
            confirmButtonText: '确定'
          });
        })
        .finally(() => {
          // 关闭加载状态
          this.$toast.clear();
        });
    },
    validateForm() {
      if (!this.input || !this.model || !this.processNo || !this.inputNum || !this.outputNum || !this.reportUser || !this.processingCost) {
        this.$toast('流转卡批号、型号、工序号、投入数、产出数、报工用户、加工费不能为空');
        return false;
      }

      if (this.defectiveTotal !== '') {
        const defectiveSum = this.defectiveItems.reduce((sum, item) => sum + Number(item.defectiveNum || 0), 0);
        if (defectiveSum !== Number(this.inputNum) - Number(this.outputNum)) {
          this.$toast('不良总数与不良项目的数量总和不一致');
          return false;
        }
      }
      return true;
    },
  }
};
</script>

<style>
.page {
  padding: 20px;
}

/* 调整按钮样式 */
.round-button {
  border-radius: 20px;
  margin: 5px;
}

.button-row {
  display: flex;
  justify-content: center;
}


.readonly-input .van-field__control {
  color: grey;
  /* 设置为灰色 */
}

.readonly-label {
  color: grey;
  /* 灰色 */
}

.page {
  padding: 20px;
}

.defect-card {
  background-color: #f0f0f0;
  /* 灰色背景 */
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  /* 圆角 */
}

.delete-round-button {
  border: none;
  /* 移除按钮的边框 */
  background-color: red;
  /* 设置按钮的背景颜色为红色 */
  color: white;
  /* 设置按钮的文字颜色为白色 */
  border-radius: 100px;
  /* 设置按钮的圆角为100px，即圆形 */
  padding: 10px 20px;
  /* 根据需要设置按钮的内边距 */
  font-size: 14px;
  /* 根据需要设置按钮的字体大小 */
}

.van-tabs__nav {
  width: 200rpx !important;
}

.main {
  padding: 0 0 75px 0;
}

.footer {
  position: fixed;
  width: 100%;
  bottom: 0px;
  padding: 10px 0;
}
</style>
