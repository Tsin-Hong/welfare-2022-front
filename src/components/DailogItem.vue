<template>
    <v-card dark class="dialog-map-info ff-wkw5 dailog-item">
        <v-toolbar flat dark>
            <v-toolbar-title class="d-block">
                <span>錦囊妙計</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text dark>
            <div class="ff-wkw5">
                <table class="item-table">
                    <thead>
                        <tr>
                            <th width="32%">名稱</th>
                            <th>使用目標</th>
                            <th>距離限制</th>
                            <th width="8%">數量</th>
                            <th width="12%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item) in showItems" :key="item.id" :title="item.detail" :class="{active: item.openUse}" class="item-tr">
                            <td>{{item.name}}</td>
                            <td class="center">{{item.useTime}}</td>
                            <td>{{item.lv == 0 ? '-' : '一格內'}}</td>
                            <td class="center">{{item.quantity}}</td>
                            <td class="center"><v-btn v-if="item.openUse" @click="onClickUse(item.id)">使用</v-btn></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import enums from '@/unit/enum'
import Vue from 'vue'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'

export default Vue.extend({
    name: 'DailogItem',
    data: () => {
        return {
            
        }
    },
    computed: {
        ...mapState(['user', 'global']),
        ...mapGetters(['getItemAllowedMapIds']),
        showItems() {
            const qmap = {}
            const myItems = this.global.items
            const myself = this.user
            const getItemAllowedMapIds = this.getItemAllowedMapIds
            // console.log('showItems myItems: ', myItems)
            myItems.map(item => {
                if (qmap[item.itemId]) {
                    qmap[item.itemId] += 1
                } else {
                    qmap[item.itemId] = 1
                }
            })
            const isLord = myself.role == 1 || myself.occupationId > 0
            const results = Object.values(this.global.itemMap).map((item: any) => {
                const quantity = qmap[item.id] || 0
                const allowedMapIds = getItemAllowedMapIds(myself, item.id)
                const captiveCanUse = item.when == 0 || !myself.captiveDate
                const openUse = allowedMapIds.length > 0 && quantity > 0 && captiveCanUse && isLord
                
                let useTime = '立即'
                switch (item.object) {
                    case 1: useTime = '任意據點'; break;
                    case 2: useTime = '己方據點'; break;
                    case 3: useTime = '敵方據點'; break;
                    case 4: useTime = '任何城池'; break;
                    case 5: useTime = '友方城池'; break;
                    case 6: useTime = '敵方城池'; break;
                    case 7: useTime = '任意野區'; break;
                    case 8: useTime = '友方野區'; break;
                    case 9: useTime = '敵方野區'; break;
                }
                return {...item, useTime, quantity, openUse, allowedMapIds}
            })
            console.log('showItems results: ', results)
            return results
        }
    },
    methods: {
        ...mapMutations(['updateGlobal', 'ChangeState', 'ChangeApiCheck']),
        ...mapActions(['actUseItem']),
        onClickUse(itemId) {
            const selectedItem = this.global.itemMap[itemId];
            this.updateGlobal({selectedItemId: itemId})
            if (selectedItem.object == 0) {
                const yes = window.confirm(`確定立即使用錦囊 [${selectedItem.name}] 嗎?`)
                if (yes) {
                    const itempk = this.global.items.find(e => e.itemId == itemId)
                    if (itempk && itempk.id) {
                        const itemPkId = itempk.id;
                        this.actUseItem({ mapId: 0, itemId, itemPkId })
                        this.ChangeState(['status_type', ''])
                        this.ChangeState(['dialog_item', false])
                    } else {
                        console.log('onClickUse failed: ', itemId, [this.global])
                    }
                }
            } else {
                this.ChangeApiCheck({ key: `[${selectedItem.name}] `, id: 5004 })
                this.ChangeState(['status_type', 'item'])
                this.ChangeState(['dialog_item', false])
            }
        }
    }
})

</script>

<style lang="scss">

.dailog-item {
    .theme--dark.v-toolbar.v-sheet {
        background-color: #380303;
        color: #ffdb72;
        border-color: #ffdb72;
        border-width: 2px;
        border-style: outset;

        .v-toolbar__title {
            font-size: 1.5em;
        }
    }

    .item-table {
        width: 100%;

        .item-tr {
            color: #868686;
            cursor: help;
            line-height: 32px;
            &.active {
                color: #fff;
                &:hover {
                    color: #ffdb72;
                    
                }
            }
            
        }

        .center {
            text-align: center;
        }

        th {
            color: #fff;
        }
    }
}
</style>