import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/auth.service.js";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUserAsync, setUser } from "../features/authSlice.js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: "onBlur" });


    const dispatch = useDispatch()
    const naviagate = useNavigate()
  const submitHandler =  (data)=> {

  let response =  dispatch(loginUserAsync(data))

  
  if(response) {
    naviagate("/")
  }
    }
  return (
    <main className="auth-page">
      <div className="auth-art">
        <Link className="welcome-brand" to="/welcome">
          <span>V</span>Vynq
        </Link>
        <div className="auth-art-copy">
          <span className="eyebrow">
            <Sparkles size={13} /> A QUIETER KIND OF COMMUNITY
          </span>
          <h1>
            Good ideas
            <br />
            <em>need company.</em>
          </h1>
          <p>
            Return to the conversations, people, and projects that keep your
            curiosity moving.
          </p>
          <div className="auth-orbit">
            <span />
            <span />
            <span />
          </div>
        </div>
        <small className="auth-footer">Vynq community / 2026</small>
      </div>
      <section className="auth-panel">
        <Link className="back-link" to="/welcome">
          <ArrowLeft size={15} /> Back to Vynq
        </Link>
        <div className="auth-card">
          <div className="auth-heading">
            <span>WELCOME BACK</span>
            <h2>
              Pick up where
              <br />
              you left off.
            </h2>
            <p>Sign in to your Vynq account.</p>
          </div>
            <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <label>
              Email address
              <div className="auth-input">
                <Mail size={17} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
              </div>
                {errors.email && <small className="form-error">{errors.email.message}</small>}
            </label>
            <label>
              Password
              <div className="auth-input">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Use at least 6 characters",
                      },
                    })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
                {errors.password && <small className="form-error">{errors.password.message}</small>}
            </label>
            <div className="form-options">
              <label className="check-label">
                  <input type="checkbox" {...register("rememberMe")} /> Remember me
              </label>
              <button type="button" className="text-button">
                Forgot password?
              </button>
            </div>
            <button className="auth-submit">
              Log in <ArrowRight size={16} />
            </button>
            <div className="auth-divider">
              <span>or continue with</span>
            </div>
            <button onClick={()=>{
              return  window.location.href = `${api}/auth/google`
            }} type="button" className="google-button">
              <span>G</span> Continue with Google
            </button>
          </form>
          <p className="auth-switch">
            New to Vynq? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
