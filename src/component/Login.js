
import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"

const Login = ({ showAlert }) => {
    const [credentials, setCredentials] = useState({email : "", password : ""})
    let navigate = useNavigate()

    const handleSubmit =  async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        })
        const json = await response.json()
        if (json.success) {
          localStorage.setItem("token", json.authtoken)
          navigate("/")
          showAlert("Successfully Logged In", "success")
        }
        else{
          showAlert("Invalid Credentials", "danger")
        }
    }
    const onChange =(e) =>{
        setCredentials({...credentials, [e.target.name] : e.target.value})
    }
  return (
    <div className='container'>
      <h2>Login to see you Notes!</h2>
      <form onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} placeholder="Enter email"/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" name="password" id="password" value={credentials.password} onChange={onChange} placeholder="Password"/>
  </div>
  <button type="submit" className="btn btn-primary">Login</button>
</form>
    </div>
  )
}

export default Login
