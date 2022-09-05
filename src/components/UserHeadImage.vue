<template>
    <div class="user-img-warpper">
        <img
            v-if="userCode && !userFailedImageHashMap[userCode]"
            class="user-img"
            :src="getUserImgUrl(userCode)"
            @error="onUserImgLoadFailed(userCode, $event)"
            alt=""
        />
        <img
            v-else
            class="user-img"
            :src="'/images/user/' + userCode + '.png'"
        />
        <img v-if="showBorder" class="img-border" src="/images/人物頭像框.png" alt="" />
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
    name: 'UserHeadImage',

    props: ['userCode', 'showBorder'],
    computed: {
        ...mapState(['global']),
    },
    data: () => ({
        roleMapObj: {
            1: '_1',
            2: '',
            3: '_0'
        },
        occupationIdMapObj: {
            1: '_2',
            2: '_2',
            3: '_3',
            4: '_3',
            5: '_3',
            6: '_3',
            7: '_3',
            8: '_3',
            9: '_4'
        },
        userFailedImageHashMap: {}
    }),
    methods: {
        getUserImgUrl(userCode) {
            const user = this.global.users.find(user => user.code == userCode)
            if (user) {
                const useUserKey = user.occupationId > 0 ? 'occupationId' : 'role'
                const mapObj = this[useUserKey + 'MapObj']
                return '/images/user/' + userCode + mapObj[user[useUserKey]] + '.png'
            }
            return '/images/user/R000.png'
        },
        onUserImgLoadFailed(code, evt) {
            // console.log('evt: ', evt);
            if (evt && evt.type == 'error') {
                this.userFailedImageHashMap[code] = true
                this.userFailedImageHashMap = {...this.userFailedImageHashMap}
            }
        },
    }
})
</script>

<style>
.user-img-warpper {
    
}
</style>
