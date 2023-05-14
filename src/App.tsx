//import logo from './logo.svg';
import React, { Component } from "react";
import './App.css';


enum DatePlateMen {
  CANCELLED_MAN = require('./imgs/white_man.svg'),
  EMPTY_MAN = require('./imgs/gray_man.svg'),
  CONFIRMED_MAN = require('./imgs/green_man.svg'),
  PENDING_MAN = require('./imgs/green_man.svg'),
  SKIPPED_MAN = require('./imgs/red_man.svg'),
  QUESTION_MAN = require('./imgs/gray_man.svg'),
}

enum DatePlateCornerImgs {
  //CANCELLED = require(''); 
  //EMPTY 
  CONFIRMED = require('./imgs/checked.svg'),
  //PENDING 
  //SKIPPED 
  //QUESTION
}


class DatePlate {
  date: Date;
  style: any;
  man: any;
  left_corner_img: any;

  constructor(date: any){
    /*
     accepts date in some format and creates classed date
    */
    this.date = new Date(date);
    this.style = ".calendar-plate-empty-container";
    this.man = DatePlateMen.EMPTY_MAN;
    this.left_corner_img = null;
  }

  extractWeekDay(): String {
    let w = this.date.getDay();
    const week = ['Вс', 'Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return week[w];
  }

  dateToString(): String {
    function addTrailingZero(num: number) {
      return ("0"+num.toString()).slice(-2);
    }
    
    let d = addTrailingZero(this.date.getDate());
    let m = addTrailingZero(this.date.getMonth() + 1);
    let dstring = `${d}.${m}`
    return dstring;
  }

  setStyles(status: String){

    switch(status){
      case 'confirmed':
        this.style = 'calendar-plate-confirmed-container';
        this.man = DatePlateMen.PENDING_MAN;
        this.left_corner_img = DatePlateCornerImgs.CONFIRMED;
        break;
      case 'pending': 
        this.style = 'calendar-plate-pending-container';
        this.man = DatePlateMen.PENDING_MAN;
        break;
      case 'cancelled': 
        this.style = 'calendar-plate-cancelled-container';
        this.man = DatePlateMen.CANCELLED_MAN;
        break;
      case 'skipped':
        this.style = 'calendar-plate-skipped-container';
        this.man = DatePlateMen.SKIPPED_MAN;
        break;
      case 'question':
        this.style = 'calendar-plate-question-mark-container';
        this.man = DatePlateMen.QUESTION_MAN;
        break;
    }
  }
}

class DatePlateComponent extends Component <{dateplate: DatePlate}> {

  constructor(props: any){
    /*
      dateplate - DatePlate
    */
    super(props);
  }
  render(): React.ReactNode{
    return (<td className="td-calendar">
        <div className={this.props.dateplate.style}>
          <img className="corner_image" src={this.props.dateplate.left_corner_img}></img>
          <img src={(this.props.dateplate.man)}></img>
          {this.props.dateplate.extractWeekDay()}<br/>
          {this.props.dateplate.dateToString()} 
        </div>
        
  </td>
  )
  }
}


class DatePlateFactory {
  private curDate: Date;
  plates: DatePlate[][];

  constructor(){
    this.curDate = new Date();
    this.plates = [];
  }

  setPlateStyle(plate: DatePlate){
    var dates: {[id: string]: any} = {
      '1-5-2023': {
        status: 'confirmed'
      },
      '4-5-2023': {
        status: 'skipped'
      },
      '13-5-2023': {
        status: 'question'
      },
      '10-5-2023': {
        status: 'cancelled'
      },
      '15-5-2023': {
        status: 'pending'
      }
    };
    const dateString: string = `${plate.date.getDate()}-${plate.date.getMonth()+1}-${plate.date.getFullYear()}`;
    console.log(dateString in dates)
    if (dateString in dates){
      plate.setStyles(dates[dateString].status)
    }
  }

  makeDateMatrix(){
    var month = this.curDate.getMonth();
    var year = this.curDate.getFullYear();
    let nextDate = new Date();
    nextDate.setFullYear(year);
    nextDate.setMonth(month);
    nextDate.setDate(1);
    var weeks: DatePlate[][] = [];
    var week: DatePlate[] = [];
    while (nextDate.getMonth() === month){
      var dp = new DatePlate(nextDate);
      this.setPlateStyle(dp);
      week.push(dp);
      nextDate.setDate(nextDate.getDate() + 1);
      if (week.length === 7){
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0){
      weeks.push(week);
    }
    this.plates = weeks;
    
  }

}


class Calendar extends React.Component{

  plates: DatePlate[][];

  constructor(props: any){
    super(props);
    this.state = {
      rows: []
    }
    var plateFact = new DatePlateFactory();
    plateFact.makeDateMatrix();
    this.plates = plateFact.plates;
    console.log(this.plates);
  }

  createTable(tabledata: DatePlate[][]){
    return (
      <table>
        <tbody>
          {
            tabledata.map((rowData, i) => {
              return (
                <tr key={i}>
                  {
                    rowData.map((cellData, i) =>{
                      return <DatePlateComponent dateplate={cellData}/>;
                    })
                  }
                  
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }

  render(){
    
    return this.createTable(this.plates);
  }
}

function App() {
  return <Calendar/>
}

export default App;
