<template>
    <v-card dark class="dialog-map-info ff-wkw5 gc-selection">
        <v-toolbar flat dark>
            <v-toolbar-title class="d-block">
                <span>{{ client.dialog_gc_selection_dataset.title }}</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text dark class="py-15-px">
            <div class="ff-wkw5 ma-1-pct">
                <div v-if="client.dialog_gc_selection_dataset.data.length > client.dialog_gc_selection_answers.length" class="flex-no-wrap justify-space-between">
                    <div v-for="(dd, idx) in client.dialog_gc_selection_dataset.data" :key="idx">
                        <div v-if="idx == client.dialog_gc_selection_answers.length">
                            <h2 class="gc-selection-title">{{dd.text}}</h2>
                            <ul v-if="dd.options && dd.options.length > 0" class="gc-selection-options">
                                <li v-for="(op) in dd.options" :key="op.value.id"
                                class="gc-selection-li"
                                :class="{enable: typeof op.enable == 'function' ? op.enable(client.dialog_gc_selection_answers[idx-1]) : op.enable}"
                                @click="onClickDailogSelection(op, idx)"
                                >{{op.display}}</li>
                            </ul>
                            <div v-else-if="dd.inputs && dd.inputs.length > 0">
                                <ul class="gc-selection-inputs">
                                    <li v-for="(inp, inpidx) in dd.inputs" :key="inp.label">
                                        <label>{{inp.label}} [{{inp.min}} - {{inp.max}}] : </label>
                                        <v-text-field
                                            v-model="tmpinputs[inpidx]"
                                            class="mt-0 pt-0"
                                            hide-details
                                            single-line
                                            :max="inp.max"
                                            :min="inp.min"
                                            type="number"
                                            style="width: 80px; display: inline-block"
                                        ></v-text-field>
                                        <v-slider
                                            v-model="tmpinputs[inpidx]"
                                            class="align-center"
                                            :max="inp.max"
                                            :min="inp.min"
                                            hide-details
                                        ></v-slider>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <p style="padding: 20px; text-align:center;">無選項</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <v-btn v-if="client.dialog_gc_selection_answers.length > 0" @click="onClickBack">返回</v-btn>
                    <v-btn v-if="isOpenSubmitBtn" @click="onClickDailogSumbit" class="right">確定</v-btn>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
// import enums from '@/unit/enum'
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'

export default Vue.extend({
    name: 'DailogGCSelection',
    data: () => {
        return {
            tmpinputs: new Array(8).fill(0)
        }
    },
    computed: {
        ...mapState(['client']),
        isOpenSubmitBtn: function() {
            return this.tmpinputs.findIndex(e => e > 0) >= 0
        }
    },
    methods: {
        ...mapMutations(['ChangeState']),
        onClickDailogSelection: function (option, deep) {
            const nextAnswers = this.client.dialog_gc_selection_answers.slice()
            if (typeof option.enable == 'function' ? option.enable(nextAnswers[deep-1]) : option.enable) {
                nextAnswers[deep] = option.value
                // console.log('nextAnswers: ', nextAnswers)
                this.makeSure(nextAnswers)
                this.tmpinputs = this.tmpinputs.map(() => 0)
            }
        },
        onClickDailogSumbit: function() {
            const deep = this.client.dialog_gc_selection_answers.length
            const inputs = this.client.dialog_gc_selection_dataset.data[deep].inputs || []
            const nextAnswers = this.client.dialog_gc_selection_answers.slice()
            const tmpinputs = this.tmpinputs
            const inputAns = inputs.map((inp, idx) => tmpinputs[idx])
            nextAnswers[deep] = inputAns
            this.makeSure(nextAnswers)
        },
        onClickBack: function() {
            this.ChangeState(['dialog_gc_selection_answers', []])
            this.tmpinputs = this.tmpinputs.map(() => 0)
        },
        makeSure: function(answers) {
            if (answers.length >= this.client.dialog_gc_selection_dataset.data.length) {
                this.client.dialog_gc_selection_dataset.callback.call(this, answers);
                this.ChangeState(['dialog_gc_selection', false])
            // this.ChangeState(['dialog_gc_selection_answers', []])
            } else {
                this.ChangeState(['dialog_gc_selection_answers', answers])
            }
        }
    }
})

</script>

<style lang="scss">

.gc-selection {
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

  .v-card__text {
    border: 1px #ffdb72 outset;
  }

  .gc-selection-title {
    color: #fff;
    padding: 4px 16px;
    border-bottom: 1px #ddd solid;
  }
  
  .gc-selection-options {
    padding: 20px;
    box-sizing: border-box;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    .gc-selection-li {
      color: #6f6f6f;
      cursor: pointer;
      pointer-events: none;

      &.enable {
        color: #ffffff;
        pointer-events: auto;
      }
      &:hover {
        color: #ffdb72;
      }
    }
  }

  .gc-selection-inputs {
    
    .show-value {
        color: #ffffff;
        font-size: 1.2em;
    }
  }

  .btns {
    padding: 20px 10px;
    .right {
        float: right;
    }
  }
}
</style>