import React,{Component} from 'react';
import JobComponent from './JobsComponent';
import Cookies from 'universal-cookie';
import HeaderComponent from './HeaderComponent';
import LoginComponent from './LoginComponent'
import basicUrl from './basicUrl';
// import axios from './axios';

class MainComponent extends Component{
    constructor(props){
    super(props)
    this.state={
        jobs:[],
        isAuth:false,
        recruiter:false,
        userId:null,
        data:[]
    }
    this.isAuthourised = this.isAuthourised.bind(this);
}  

    isAuthourised=(response)=>{
        this.setState({isAuth:response.isAuth,recruiter:response.recruiter,userId:response.id});
        console.log(response);
            fetch('http://localhost:9100/jobs',{
        method:'GET',
        credentials:'include',
        mode:'cors'
    }
    )
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response=>this.setState({jobs:response}))
    if(!this.state.recruiter){
        fetch('http://localhost:9100/jobs/applied',{
        method:'GET',
        credentials:'include',
        mode:'cors'
    }
    )
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response=>{this.setState({data:this.state.data.concat(response)})
    console.log(this.state.data)
})
console.log(this.state.data)
    this.setState({jobs:this.state.jobs.filter(el=>!this.state.data.includes(el))})
    }
}

    isNotAuthourised=()=>{
        fetch('http://localhost:9100/user/logout',{
        method:'GET',
        credentials:'include',
        mode:'cors'
    }
    )

        this.setState({
            jobs:[],
            isAuth:false,
            recruiter:false,
            userId:null,
            data:[]
    })
    }
    componentDidMount(){
        fetch(basicUrl+"/user/profile",{
            method:'GET',
            credentials:'include',
            mode:'cors'
        }).then(response=>response.json())
        .then(response=>{
            if(response.isAuth){
                this.isAuthourised(response)
            }
            else{
                this.isNotAuthourised();
            }
        })
}
    render(){
        return (
            <React.Fragment>
                <div>
                    <HeaderComponent isauth={this.state.isAuth} handleLogout={this.isNotAuthourised}/>
                    {!this.state.isAuth?
                        <LoginComponent isAuthourised={this.isAuthourised}/>
                    :
                    <JobComponent jobs={this.state.jobs} user={{userId:this.state.userId,recruiter:this.state.recruiter}} data={this.state.data}/>
                    }
                    
                    </div>
            </React.Fragment>
            )
    }
}

export default MainComponent;