export default class CalendarUtils {
  dayofMouth: number[]
  constructor() {
    this.dayofMouth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  }

  getWeekofFirstDay(yearNow: number, mouthNow: number) {
    var tmpDate = new Date(yearNow, mouthNow, 1)
    return tmpDate.getDay()
  }

  getNowDate() {
    const dataNow = new Date()
    return {
      yearNow: dataNow.getFullYear(),
      mouthNow: dataNow.getMonth(),
      dayNow: dataNow.getDate(),
      hourNow: dataNow.getHours().toString().padStart(2, '0'),
      minuteNow: dataNow.getMinutes().toString().padStart(2, '0'),
      secondNow: dataNow.getSeconds().toString().padStart(2, '0')
    }
  }

  getMouthInCalender(yearNow: number, mouthNow: number) {
    if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
      this.dayofMouth[1] = 29
    } else {
      this.dayofMouth[1] = 28
    }
    const firstDayofMouth = this.getWeekofFirstDay(yearNow, mouthNow) // 这个月一号的星期数

    const lastMouthIndex = mouthNow === 0 ? 11 : mouthNow - 1

    const indeedDay = new Array(42)
    // 获取每月开始的日期（从上个月的星期日开始）
    let dayofMouthStart = 0
    if (mouthNow === 0) {
      dayofMouthStart = this.dayofMouth[11] - (firstDayofMouth === 0 ? 6 : firstDayofMouth - 1)
    } else {
      dayofMouthStart = this.dayofMouth[lastMouthIndex] - (firstDayofMouth === 0 ? 6 : firstDayofMouth - 1)
    }
    // 填充上个月的日期
    for (let i = dayofMouthStart; i <= this.dayofMouth[lastMouthIndex]; i++) {
      indeedDay[i - dayofMouthStart] = i
    }

    const daysInLastMouth = this.dayofMouth[lastMouthIndex] - dayofMouthStart + 1

    // 填充当前月的日期
    for (let i = 0; i < this.dayofMouth[mouthNow]; i++) {
      indeedDay[daysInLastMouth + i] = i + 1
    }
    // 填充下个月的日期
    const indexOfDaysInNextMouth = this.dayofMouth[mouthNow] + daysInLastMouth
    for (let i = 0; i < 42 - indexOfDaysInNextMouth; i++) {
      indeedDay[indexOfDaysInNextMouth + i] = i + 1
    }
    return { indeedDay, daysInLastMouth, indexOfDaysInNextMouth }
  }
}