<template>
  <div class="address-edit-box">
    <sheader :name="type == 'add' ? '新增地址' : '编辑地址'" :back="'-1'" />
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-set-default
      show-search-result
      :search-result="searchResult"
      :address-info="addressInfo"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import sheader from "../components/header";
import { tdist } from "../utils/utils";
import { addAddress, getAddress,editAddress} from "../../axios/interface/address";
import { Toast } from "vant";

export default {
  components: {
    sheader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      from: route.query.from,
      type: route.query.type,
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      addressInfo: {},
      addressid:'',
    });
    onMounted(async () => {
      // 省市区列表构建
      let _province_list = {};
      let _city_list = {};
      let _county_list = {};
      tdist.getLev1().forEach((p) => {
        _province_list[p.id] = p.text;

        tdist.getLev2(p.id).forEach((c) => {
          _city_list[c.id] = c.text;

          tdist.getLev3(c.id).forEach((q) => (_county_list[q.id] = q.text));
        });
      });
      state.areaList.province_list = _province_list;
      state.areaList.city_list = _city_list;
      state.areaList.county_list = _county_list;
      if (state.type == "edit") {
        let { data } = await getAddress({ id: route.query.addressid });
        state.addressid = data.id
        console.log(data);
        const toCode = (area, code) => {
          for (let key in tdist)
            if (tdist[key][0] == area && tdist[key][1] == code) return key;
        };
        // 拿到省级code，利用省级code找到市级code，利用市级code找到区对应的code
        let provinceCode = toCode(data.province, "1"); // 1
        let cityCode = toCode(data.city, provinceCode); // 110000
        let regionCode = toCode(data.county, cityCode); // 231283  // 110104
        state.addressInfo = {
          id: data.id,
          name: data.name,
          tel: data.tel,
          province: data.province,
          city: data.city,
          county: data.county,
          addressDetail: data.addressDetail,
          postalCode:data.postalCode,
          areaCode: regionCode,
          isDefault: !!data.isDefault.data[0],
        };
      }
    });

    //保存地址 or 修改地址
    const onSave = async (e) => {
      console.log(e);
      if (state.type == "add") {
        let res = await addAddress(e);
        if (res.code == "80000") {
          Toast.success(res.message);
          setTimeout(() => {
            router.push({ path: "/address", query: { from: state.from } });
          }, 500);
        } else {
          Toast.fail(res.message);
        }
      } else {
        let data = {}
        data = e
        data.id = state.addressid
        let res = await editAddress(data);
        if (res.code == "80000") {
          Toast.success(res.message);
          setTimeout(() => {
            router.push({ path: "/address", query: { from: state.from } });
          }, 500);
          
        } else {
          Toast.fail(res.message);
        }
      }
    };
    return {
      ...toRefs(state),
      onSave,
    };
  },
};
</script>

<style lang="less">
@import "../assets/mixin";
.address-edit-box {
  margin-top: 1rem;
  .van-address-edit {
    .van-button--danger {
      background-color: @btncol !important;
      border-color: @btncol;
    }
    .van-switch--on {
      background-color: @btncol;
    }
  }
}
</style>
