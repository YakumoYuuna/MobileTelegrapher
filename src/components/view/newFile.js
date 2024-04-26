import axios from 'axios';

//http://192.168.191.25:8080/ReportWork?fid=111121&xh=xh1&gxh=gxh1&bllx=cs1,cs2,cs34
export default (await import('vue')).defineComponent({
data() {
return {
input: '12346528817261527',
model: 'NTSA2B104F3999',
processNo: '灌封放壳',
inputNum: '',
outputNum: '',
defectiveTotal: '',
reportUser: '',
processingCost: '12',
defectiveItems: [],
showPopup: false,
defectiveItemList: ['默认值1', '默认值2', '默认值3'],
userList: ['用户1', '用户2', '用户3'], // 添加userList变量
showUserPopup: false
};
},
created() {
// 获取路由参数并解析
// const routeParams = this.$route.params;
// // if (routeParams.jsonData) {
// // const jsonData = JSON.parse(routeParams.jsonData);
const jsonData = JSON.parse(JSON.stringify({
FID: '101880',
xh: 'xh',
gxh: 'gxh',
bgyh: ['yh1', 'yh2', 'yh3'],
blxm: ['xm1', 'xm2', 'xm3']
}));

// this.input = jsonData.FID;
// this.model = jsonData.xh;
// this.processNo = jsonData.gxh;
this.userList = jsonData.bgyh;
this.defectiveItemList = jsonData.blxm;
// }
if (Object.keys(this.$route.query).length > 0) {
// 执行你的逻辑
this.input = this.$route.query.fid || '';
this.model = this.$route.query.xh || '';
this.processNo = this.$route.query.gxh || '';
this.processingCost = this.$route.query.jgf || '';
// this.defectiveItemList = this.$route.query.bllx.split(',')
}
if (this.input) {
this.fetchUserData();
}

},
methods: {
fetchUserData() {
// 创建一个 Axios 实例
const api = axios.create({
baseURL: 'http://192.168.191.41:8890', // 设置基本URL
timeout: 5000, // 设置超时时间
});
const jsonData = JSON.parse(JSON.stringify([
{
"id": "kingdee",
"name": "0001"
},
{
"id": "0000",
"name": "刘刚"
}
]));
// // 发送 GET 请求
// api.get('/GetYh')
//   .then(response => {
//     // 请求成功的处理逻辑
//     console.log(response.data); // 打印返回的数据
//     const users = response.data.map(item => ({ id: item.id, name: item.name }));
//     this.userList = users;
//     this.reportUser = this.userList[0].name; // 默认选中第一个用户
//   })
//   .catch(error => {
//     // 请求失败的处理逻辑
//     console.error('失败');
//     console.error(error);
//     // 弹窗提示报工失败，请重试
//     this.$dialog.alert({
//       title: '提示',
//       message: '接口调用失败，请重试',
//       confirmButtonText: '确定'
//     });
//   });
},
showDefectiveItems(index) {
this.showPopup = true;
this.popupIndex = index;
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
clear() {
this.input = '';
this.model = '';
this.processNo = '';
this.inputNum = '';
this.outputNum = '';
this.defectiveTotal = '';
this.reportUser = '';
this.processingCost = '';
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
},
redirectToText1() {
this.$router.push('Text2'); // 跳转到text1页面，具体路径需要根据实际情况调整
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
GXH: this.processNo,
inputNum: this.inputNum,
FQuaQty: this.outputNum,
FProcessFailQty: this.defectiveTotal,
FStaffNumber: this.reportUser,
processingCost: this.processingCost,
FSubEntity: this.defectiveItems.map(item => ({
FOperDefectQty: item.defectiveNum,
FDefectReasonId: {
FNUMBER: item.defectiveItem
}
}))
};

// 创建一个 Axios 实例
const api = axios.create({
baseURL: 'http://192.168.191.65:8890', // 设置基本URL
timeout: 5000, // 设置超时时间
});
console.log(data); //打印数据

// 发送 POST 请求
api.post('/BYtest', data)
.then(response => {
// 请求成功的处理逻辑
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
// console.error('失败');
// console.error(error);
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
});
