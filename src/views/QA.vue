<template>
  <div class="qa-page">
    <div class="qa-area">
      <img class="img img-02" src="/images/龍.png" alt="" />
      <img class="img img-01" src="/images/人物.png" alt="" />
      <v-card class="mx-auto login-block" dark>
        <v-list-item three-line>
          <v-list-item-content>
            <img class="img img-03" src="/images/故事.png" alt="" />
            <v-divider class="my-3"></v-divider>
            <h1 class="text-center pt-10">【首波】群雄割據 Q&A</h1>
            <div class="text-content py-10 px-10">
              此階段是正式開始(2/10)遊戲前的人物角色選擇，主要目標有:
              <ol class="py-5 px-10">
                <li>產生初始國家</li>
                <li>同仁進入遊戲開局的角色選擇</li>
              </ol>
              達成以上目標，今年遊戲就能正式開局，2/10之後玩家還是可依照第二波公告內容
              建國/入仕/下野。 近日得到的回饋，相關回覆如下:
              <ol class="py-5 pl-10">
                <li v-for="(item, index) in list" :key="index">
                  {{ item[0] }}
                  <ul>
                    <li v-for="(a, a_index) in item[1]" :key="'a-' + a_index">
                      {{ a }}
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      account: '',
      firstLogin: false,
      passwordShow: false,
      passwordCheck: '',
      list: [
        [
          '角色名稱命名的條件?',
          ['A: 使用自己的姓+英文名 音/意譯成中文，方便辨識即可。']
        ],
        [
          '創國等於創社團嗎?',
          [
            'A: 創國成功不等於創社團成功，而符合以下兩條件者才「有權」創社團: 1.成功創國 2.角色為君主or第二波公告的新官職。社團申請與審核規則以公司後續公告的社團辦法為主。'
          ]
        ],
        [
          '找人以社團為主體還是以遊戲為主體?',
          ['A: 找人以自由意志為上，想以什麼方向為主體都沒問題。']
        ],
        ['社團團員與國家成員是否綁定?', ['A: 非硬性綁定。']],
        [
          '可以同時加入2個以上的社團嗎?',
          ['A: 可以，但經費核銷申請須符合後續公司公告的社團辦法。']
        ],
        [
          '可以參加別國的社團活動嗎?',
          ['A: 可以，但經費核銷申請須符合後續公司公告的社團辦法。']
        ],
        [
          '換國家的成員社團會怎麼改變?',
          ['A: 成員換國家不代表退社，所以社團不會有所改變。']
        ],
        [
          '成為君主創建社團，可以使用康樂基金去辦活動，邀請大家參加。但加入我國的武將都是我參加福委活動的組員對吧?',
          [
            'A: 可以邀請其他國家成員參與自己社團的活動，但經費核銷申請須符合後續公司公告的社團辦法。是，國家成員都會是一起征戰沙場的夥伴。'
          ]
        ],
        [
          '君主或在一年裡突然離職，剩下武將的去向?',
          [
            'A: 君主離職不影響武將去向，該國會發生「禪讓」事件，事件說明會在第二波遊戲方式公告內容。'
          ]
        ],
        [
          '滅國後社團是否還存在?',
          ['A: 存在，滅國的社團後續流程於第二波公告說明。']
        ],
        ['浪人能參加社團嗎?', ['A: 不行，因為沒有康樂基金使用權。']],
        ['浪人加入國家後，能"隨時"退出國家嗎?', ['A: 在指定時間內操作皆可。']],
        [
          '浪人有機會轉正嗎? 因為開局君主+武將只能15人。',
          ['A: 可以的，2/10遊戲正式開始前會公告第二波遊戲方式。']
        ],
        ['有預設接受幾個國家嗎? ', ['A: 無，自由創國。']],
        [
          '想更換城池、角色名稱、更改加入其他國家。 ',
          ['A: 重填一次表單即可，但排序會依最新送出的時間為主。']
        ],
        [
          '創建社團的審核準則(名稱或內容限制)、活動規則等細項是甚麼? 社團需要成果發表嗎?',
          ['A: 關於社團詳細辦法將由公司後續統一佈達。']
        ],
        [
          '社團辦法未出，造成建國困擾。',
          ['A: 社團詳細辦法由公司統一佈達，還望見諒。']
        ],
        [
          '福委回覆內容不一致造成困擾。',
          [
            'A: 日後所有關於今年2022年福委活動之問題，出口統一由我 謝智宇/White.Hsieh 做回答，造成不便，還請見諒。'
          ]
        ]
      ]
    }
  }
}
</script>

<style lang="scss">
body,
html {
  overflow-y: hidden !important;
}
.qa-page {
  height: 100vh;
  background-color: #ca6b2b;
  padding: 1px;
  overflow-y: hidden !important;
  .qa-area {
    position: relative;
    z-index: 0;
    overflow-y: scroll;
    height: 100%;

    .text-content {
      font-size: 18px;
      line-height: 25px;
    }
    ul {
      list-style: none;
    }
    li {
      padding: 10px 0;
    }
  }
  &::before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    opacity: 0.4;
    background-image: url('/images/bg01.jpg');
    background-repeat: repeat-x;
    background-position: center bottom;
    z-index: 0;
  }
  img {
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    &.img-01 {
      width: 30%;
      margin-top: -5%;
    }
    &.img-02 {
      width: 20%;
    }
    &.img-03 {
      width: 100%;
    }
  }
  .login-block {
    position: relative;
    z-index: 1;
    margin-top: -8%;
    width: 50%;
    max-width: 980px;
    background-color: #1e1e1ec7 !important;
  }
}
</style>
