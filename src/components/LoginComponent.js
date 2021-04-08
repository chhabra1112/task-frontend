import React,{Component} from 'react';
import {Tabs,Tab, Form, Button, Alert} from 'react-bootstrap';
import basicUrl from './basicUrl';


const LoginComponent = (props)=>{
    return(
        <div className="container" id="auth">
            <div className="row">
                <div className="authbox">
                    <Tabs className="pt-30" defaultActiveKey="login" id="uncontrolled-tab-example">
                    <Tab eventKey="login" title="Login">
                    <Login isAuthorised ={props.isAuthourised}/>
                    </Tab>
                    <Tab eventKey="signup" title="Sign Up">
                    <SignUp/>
                </Tab>
            </Tabs>
        </div>
        </div>
        </div>
    )
}

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state={
            name:"",
            email:"",
            password:"",
            recruiter:false,
            success:false
        }
        this.handleSignUp.bind(this);
    }
    handleSignUp=(e)=>{
        e.preventDefault();
        console.log(this.state);
        const user = {email:this.state.email,password:this.state.password,recruiter:this.state.recruiter,username:this.state.name};
        fetch(basicUrl+'/user/register',{
            method: 'POST',
            mode:'cors',
            credentials:'include',
            headers: { 
                'Content-Type':'application/json' 
            },
            body: JSON.stringify(user)
        }
        ).then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
            },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => {
            if (!response.isAuth) {
            }
            else if(response.isAuth){
                this.setState({name:"",
                email:"",
                password:"",
                recruiter:false,
                success:true})
                
            }
            else {
                var error = new Error('Error ' + response.status);
                error.response = response;
                throw error;
            }
            
        })
    }
    render(){
    return (
        <div>{this.state.success?
            <Alert variant='success'>
            Your E-mail is registed. You can login now.
            </Alert>
            :null
    }
            <Form onSubmit={(e)=>{this.handleSignUp(e)}}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="name" placeholder="Enter Name" 
                        value={this.state.name}
                        onChange={e=>this.setState({name:e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" 
                        value={this.state.email}
                        onChange={e=>this.setState({email:e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" 
                        value={this.state.password}
                        onChange={e=>this.setState({password:e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="recruiter">
                        <Form.Check type="checkbox" label="Recruiter" 
                        name="Recruiter"
                        checked={this.state.recruiter}
                        onChange={e=>this.setState({recruiter:e.target.checked})}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sign Up
                    </Button>
                    </Form>
        </div>
    )
    }
}
class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            email:"",
            password:""
        }
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin = (e)=>{
        e.preventDefault();
        const user = {email:this.state.email,password:this.state.password};
        fetch(basicUrl+'/user/login',{
            method: 'POST',
            mode:'cors',
            headers: { 
                'Content-Type':'application/json' 
            },
            credentials:'include',
            body: JSON.stringify(user)
        }
        ).then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
            },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => {
            if (!response.isAuth) {
                console.log(response);
            }
            else if(response.isAuth){
                this.props.isAuthorised(response);
            }
            else {
                var error = new Error('Error ' + response.status);
                error.response = response;
                throw error;
            }
            
        })
        
    }
    render(){

    return (
        <div>
                <Form onSubmit={(e)=>{this.handleLogin(e)}}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" 
                        value={this.state.email}
                        onChange={e=>this.setState({email:e.target.value})}/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" 
                        value={this.state.password}
                        onChange={e=>this.setState({password:e.target.value})}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    </Form>
        </div>
    )
    }
}

export default LoginComponent;