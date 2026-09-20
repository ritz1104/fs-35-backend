import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import api from "../config/api.js";




function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate()

  // const handleContinueWithGoogle = ()=>{
  //   return 
  // }

  const onSubmit =async  (data) => {
     const formData = new FormData()
  
     formData.append("username",data.username)
     formData.append("fullname",data.fullName)
     formData.append("email",data.email)
     formData.append("password",data.password)

     if(data.profile_pic?.[0]){
      formData.append("profile_pic",data.profile_pic[0])
     }


    const response = await registerUser(formData)

    if(response) {
      navigate('/welcome')
    }
  
    }


  return (
    <main className="auth-page register-page">
      <div className="auth-art">
        <Link className="welcome-brand" to="/welcome">
          <span>V</span>Vynq
        </Link>
        <div className="auth-art-copy">
          <span className="eyebrow">
            <Sparkles size={13} /> FIND YOUR PEOPLE
          </span>
          <h1>
            Make space
            <br />
            <em>for possibility.</em>
          </h1>
          <p>
            Meet the generous minds behind the projects you admire, and bring
            your own work into the room.
          </p>
          <div className="join-stack">
            <span>AM</span>
            <span>SC</span>
            <span>RM</span>
            <strong>+12k builders</strong>
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
            <span>CREATE YOUR SPACE</span>
            <h2>
              Start with
              <br />a hello.
            </h2>
            <p>It only takes a moment to join Vynq.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="register-fields">
              <label>
                Username
                <div className="auth-input">
                  <UserRound size={16} />
                  <input
                    placeholder="your.handle"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Use at least 3 characters",
                      },
                    })}
                  />
                </div>
                {errors.username && <small className="form-error">{errors.username.message}</small>}
              </label>
              <label>
                Full name
                <div className="auth-input">
                  <input
                    placeholder="Alex Morgan"
                    {...register("fullName", { required: "Full name is required" })}
                  />
                </div>
                {errors.fullName && <small className="form-error">{errors.fullName.message}</small>}
              </label>
            </div>
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
                  type="password"
                  placeholder="At least 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Use at least 8 characters",
                    },
                  })}
                />
              </div>
              {errors.password && <small className="form-error">{errors.password.message}</small>}
            </label>
            <label className="upload-field">
              <ImagePlus size={17} />
              <span>
                <input type="file" accept="image/png,image/jpeg" {...register("profile_pic")} />
                <strong>Add a profile image</strong>
                <small>Optional · JPG or PNG</small>
              </span>
              <ArrowRight size={15} />
            </label>
            <label className="check-label terms-check">
              <span className="fake-checkbox">
                <Check size={11} />
              </span>
              <input
                type="checkbox"
                {...register("terms", { required: "Please accept the community guidelines" })}
              /> I agree to the Vynq terms and community guidelines.
            </label>
            {errors.terms && <small className="form-error terms-error">{errors.terms.message}</small>}
            <button className="auth-submit">
              Create account <ArrowRight size={16} />
            </button>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <button onClick={()=>{
              return  window.location.href = `${api}/auth/google`
            }} type="button" className="google-button">
              <span>G</span> Continue with Google
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
