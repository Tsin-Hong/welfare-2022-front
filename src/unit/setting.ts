const serverIp = '172.16.20.73';
// const socketLocation = 'http://172.16.20.73:20221/'
const qaQocketLocation = `http://${serverIp}:12022`
const myDevComputerIp = '172.16.2.111';

export default {
  getSocketLocation: function (): any {
    switch (window.location.hostname) {
      case serverIp: return window.location.origin
      case myDevComputerIp: return `http://${myDevComputerIp}:81`
      default: 
        return qaQocketLocation
    }
  }
}
