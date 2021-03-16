import React, { Component } from 'react'
import "../assets/scss/_base.scss"
import FullThrottle from '../assets/images/fullThrottle.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserService } from '../components/UserServices.js'
import moment from "moment";

export class Users extends Component {
    constructor(props) {
        super(props);
        this.state={
            userData:[],
            activeData:[],
            date:'',
            activityTime:[],
            noDataMsg:'Please select one date!'
        }
    }
    componentDidMount (){
        this.setState({userData:UserService.getUserData()})
    }
    openModal= (item)=>{
        this.setState({activeData:item})
        let elmModal = document.getElementById("userModal");
        elmModal.classList.add("open");
    }
    closeModal = () =>{
        this.setState({activeData:[],date:'',activityTime:[]})
        let elmModal = document.getElementById("userModal");
        elmModal.classList.remove("open");
    }
    
    onChange = (date) =>{
         let dateFormated = moment(date).format('MMM DD YYYY')
         let activityTime=[]
         for(var i=0;i<this.state.activeData.activity_periods.length;i++){
             let dateFromApi = this.state.activeData.activity_periods[i].start_time.substring(0,11)
             if(dateFromApi == dateFormated){
                 let startAndEnd ={ start:this.state.activeData.activity_periods[i].start_time.slice(12) ,end:this.state.activeData.activity_periods[i].end_time.slice(11)}
                 activityTime.push(startAndEnd)
             }    
         }
         if(activityTime.length===0){
            
             this.setState({noDataMsg:"No activity on this day!"})
         }
         else{
             this.setState({noDataMsg:''})
         } 
        this.setState({date,activityTime})
        
    }
    render() {
       
        const{userData,date}=this.state
        return (
            <React.Fragment>     
                <div className="outer">
                    <div className="mainPage">Users List<hr></hr><ul>
                        {userData.map((item, index) => (
                        <li key={item.id} onClick={()=>this.openModal(item)} >{item.real_name}</li>
                         ))}
                        </ul>    
                    </div>
                </div>
                <div className="customModal userModal" id="userModal">
                    <div className="customModalProfileBlock">
                        <a  className="close" onClick={this.closeModal} ></a>
                        <div className="brand-logo row mb-3 mb-lg-4">
                            <div className="col-6 FullThrottleLogo"><img src={FullThrottle} alt="Conduent" className="img-fluid" /></div>
                            <span className="btnRightAlingment">
                                <span className="SelectDate" >Select Date<DatePicker  selected={date}   onChange={date =>this.onChange(date)}/></span>
                            </span>
				        </div>
                        <span className="fontStyle">User Name  : {this.state.activeData?this.state.activeData.real_name:null}</span>
                    <br></br><br></br>          
                 {this.state.activityTime.length>0?         
                    <div className="customModalBody">
                        <table className="table ">
                            <tbody>
                                <tr>
                                    <th scope="row">Start Time</th>
                                    <th scope="row">End Time</th>
                                </tr>
                                <tr>
                                    <td scope="row"> {this.state.activityTime[0].start}</td>  
                                    <td scope="row">{this.state.activityTime[0].end}</td>  
                                </tr>
                            </tbody>
                    </table>
                    </div>:<span className="msgContent">{this.state.noDataMsg}</span>}
                </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Users
