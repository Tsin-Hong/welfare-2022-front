import moment from "moment";

moment.locale("tw");

export default function install(Vue) {
  Object.defineProperties(Vue.prototype, {
    $moment: {
      get() {
        return moment;
      }
    }
  });
}
