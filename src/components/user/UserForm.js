import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import swal from "sweetalert";

import { libraryContext } from "../../App";

const UserForm = ({type}) => {

  const {getUsersFromServer} = useContext(libraryContext);
  
  const [data, setData] = useState({
    name: "",
    family: "",
    socialNumber: "",
  });

  const history = useHistory();
  const {userId} = useParams();

  useEffect(() => {
    if(type === "edit") {
        axios.get(`http://localhost:8085/api/user?id=${userId}`)
        .then(response => {
          if(response.data !== null) {
            setData({
              name: response.data.name,
              family: response.data.family,
              socialNumber: response.data.socialNumber,
            })
          }
        })
    }
     
  }, [])

  const saveNewUser = () => {
    axios.post("http://localhost:8085/api/savenewuser", data)
      .then(response => {
        swal({
          title: "اطلاعیه",
          text: "کاربر جدید با موفقیت ذخیره شد",
          icon: "success",
          button: "متوجه شدم",
        });
        getUsersFromServer();
        history.push("/users");
      })
      .catch(error => console.log(error));
  };

  const updateUser = () => {
    const saveData = {...data, id: userId}
    axios.post("http://localhost:8085/api/updateuser", saveData)
    .then(response => {
      console.log(response.data)
      swal({
        title: "اطلاعیه",
        text: "کاربر با موفقیت آپدیت شد",
        icon: "success",
        button: "متوجه شدم",
      });
      getUsersFromServer();
      history.push("/users");
    })
    .catch(error => console.log(error));
  }

  const inputHandler = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = event => {
    event.preventDefault();
    if (
      data.name === "" || data.family === "" || data.socialNumber === "" ) {
        swal({
          title: "هشدار",
          text: "وارد کردن تمام مقادیر الزامی است",
          icon: "error",
          button: "متوجه شدم",
        });
    } else if(type === "create") {
      saveNewUser();
    } else if(type === "edit") {
      updateUser();
    }
  };

  const deleteData = () => {
    setData({
      name: "",
      family: "",
      socialNumber: "",
    });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>نام</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={data.name}
            onChange={inputHandler}
          />
        </div>
        <div className="form-group">
          <label> نام خانوادگی </label>
          <input
            type="text"
            className="form-control"
            name="family"
            value={data.family}
            onChange={inputHandler}
          />
        </div>
        <div className="form-group">
          <label> </label>
          <label>کد ملی </label>
          <input
            type="number"
            className="form-control"
            name="socialNumber"
            value={data.socialNumber}
            onChange={inputHandler}
          />
        </div>
        <br />
        <br />

        <button type="submit" className="btn btn-primary">
          ذخیره
        </button>
        <button type="submit" className="btn btn-secondary mr-5" onClick={() => {history.push("/users")}} >
          انصراف
        </button>
      </form>
    </>
  );
};

export default UserForm;
