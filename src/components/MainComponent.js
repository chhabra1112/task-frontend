import React,{Component} from 'react';
import RenderMyJobs from './JobsComponent';
import Cookies from 'universal-cookie';
import HeaderComponent from './HeaderComponent';
import {Container} from 'reactstrap';
// import axios from './axios';

class MainComponent extends Component{
    constructor(props){
    super(props)
    this.state={
        jobs:[]
    }}
    // componentDidMount(){
    //     new Cookies().set('auth', 'eyJhbGciOiJIUzI1NiJ9.NjA2OGI1ODFkZGM2NDgyMTA4NmQ4NDRk.EGbU8bl1UVkB0MDvj-AQ8jgutQhVkbyO9RX8WZIZr74', { path: '/' });
    //     fetch('http://localhost:9100/jobs',{
    //         credentials:'include',
    //         mode:'cors'
    //     })
    //     .then(response => {response.json()})
    //     .then(data => this.setState({jobs:this.state.jobs.concat(data)}));
    //     console.log(this.state.jobs);
    // }
    
    render(){
        var jobs = []
        const cookies = new Cookies();
        cookies.set('auth', 'eyJhbGciOiJIUzI1NiJ9.NjA2OGI1ODFkZGM2NDgyMTA4NmQ4NDRk.EGbU8bl1UVkB0MDvj-AQ8jgutQhVkbyO9RX8WZIZr74', { path: '/' });
        var fetchJobs= ()=> fetch('http://localhost:9100/jobs',{
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
        fetchJobs();
        return (
            <React.Fragment>
                <div>
                    <HeaderComponent/>
                    <RenderMyJobs jobs={this.state.jobs}/>
                    </div>
            </React.Fragment>
            )
    }
}

export default MainComponent;