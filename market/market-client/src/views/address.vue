<template>
  <sheader :name="'管理地址'" :back="from == '/account' ? '/cart' : '/user'" />
  <div class="main">
    <van-swipe-cell v-for="item in allAddress" :key="item.id">
      <div class="address" @click="selectAddress(item.id)">
        <div class="left">
          <div class="top">
            <span class="name">{{ item.name }}</span
            ><span class="phone">{{ item.tel }}</span
            ><span class="default" v-if="item.isDefault.data[0]">默认</span>
          </div>
          <div class="bottom">
            {{ item.province }} {{ item.city }} {{ item.county }}
            {{ item.addressDetail }}
          </div>
        </div>
        <van-icon name="edit" class="edit-icon"  @click.stop="editAddress(item.id)"/>
      </div>
      <template #right>
        <van-button
          square
          type="danger"
          icon="delete-o"
          class="delete-button"
          @click="deleteOne(item.id)"
        />
      </template>
    </van-swipe-cell>

    <div class="create-address">
      <van-button
        hairline
        round
        type="small"
        color="#14c965"
        class="btnsize"
        @click.stop="addAddress"
      >
        新增地址
      </van-button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import sheader from "../components/header";
import { getAllAddress, deleteAddress } from "../../axios/interface/address";
import { Toast } from "vant";
export default {
  components: {
    sheader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      allAddress: [],
      from: route.query.from,
    });
    onMounted(async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let res = await getAllAddress();
      console.log(res);
      if (res.code == "80000") {
        state.allAddress = res.data;
        Toast.clear();
      }
    });
    //删除某个地址
    const deleteOne = async (id) => {
      Toast.loading({
        message: "删除中...",
        forbidClick: true,
      });
      let res = await deleteAddress({ id: id });
      if (res.code == "80000") {
        Toast.success(res.message);
        state.allAddress = state.allAddress.filter((item) => item.id !== id);
        console.log(state.allAddress);
      } else {
        Toast.fail(res.message);
      }
    };
    //选择某个地址
    const selectAddress = (id) => {
      if (state.from == "/account") {
        router.push({ path: "/account", query: { addressid: id } });
      }
    };

    //新增地址
    const addAddress = () => {
      router.push({ path: "/addAddress", query: { from: state.from ,type:'add'} });
    };

    //编辑地址
    const editAddress = (id) =>{
      console.log(id);
      router.push({ path: "/addAddress", query: { from: state.from ,type:'edit',addressid:id} });
    }
    return {
      ...toRefs(state),
      addAddress,
      deleteOne,
      selectAddress,
      editAddress
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.main {
  background-color: @bc;
  padding: 1.2rem 0.2rem 3rem;
  .boxSizing();
  .address {
    background-color: #fff;
    padding: 0.2rem;
    margin-bottom: 0.2rem;
    border-radius: 0.2rem;
    .fj();
    .left {
      .top {
        margin-bottom: 0.3rem;
        .name {
          font-size: 0.4rem;
          margin: 0 0.2rem 0.2rem 0;
        }
        .phone {
          color: #999;
        }
        .default {
          margin-left: 0.2rem;
          background: @primary;
          color: #fff;
          padding: 0.08rem 0.16rem;
          border-radius: 0.5rem;
        }
      }
    }
    .edit-icon {
      font-size: 0.5rem;
    }
  }
  .delete-button {
    height: 100%;
  }
  .create-address {
    box-sizing: border-box;
    padding: 0.2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: #fff;
    width: 100%;
    .btnsize {
      width: 100%;
    }
  }
}
</style>