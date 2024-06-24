import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Signup = (props) => {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    })
    const json = await response.json()
    if (json.success) {
      localStorage.setItem("token", json.authtoken)
      navigate("/")
      props.showAlert("Account Created Successfully", "success")
    }
    else {
      props.showAlert("Invalid Credentails", "danger")
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className='contianer'>
      <div className="container">
        <h2>Sign up to continue to iNotebook!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Name</label>
            <input type="text" className="form-control" id="name" name="name" placeholder="name" onChange={onChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange}/>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={onChange} minLength={5} required/>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name="cpassword" placeholder="cPassword" onChange={onChange} minLength={5} required/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

      </div>
    </div>
  )
}

export default Signup
