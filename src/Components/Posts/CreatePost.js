import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dropzone from "react-dropzone";
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import { createpostAction } from "../redux/reducers/postSlice";
import CategoryDropdown from "./CategoryDropdown";
import { useNavigate } from "react-router-dom";


//Form schema
const formSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category:Yup.object().required("Category is required"),
  image : Yup.string().required('Image is required')
});

const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isFocused) {
      return '#2196f3';
  }
  return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

export default function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
 
  //select store data
  const post = useSelector(state=>state?.posts)

  const { isCreated , loading , appErr , serverErr } = post 
  const formik = useFormik({
    initialValues: {
      title: "",
      description:"",
      category:"",
      image:""
    },
    onSubmit: (values) => {
      
      const data = {
        category:values?.category,
        title:values?.title,
        description:values?.description,
        image:values?.image
      }
      //dispath the action
      dispatch(createpostAction(data))
    },
   validationSchema: formSchema,
  });

  useEffect(() => {
    if(isCreated){ 
    navigate('/posts')
    }
  }, [isCreated, navigate])

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Create Post
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-green-600 hover:text-indigo-500">
              Share your ideas to the word. Your post must be free from
              profanity
            </p>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  {/* Title */}
                  <input
                    id="title"
                    value={formik.values.title}
                    onChange={formik.handleChange("title")}
                    onBlur={formik.handleBlur("title")}
                    name="title"
                    type="title"
                    autoComplete="title"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched.title 
                  && formik.errors.title}
                </div>
              </div>
              {/* Category input goes here */}
              <label
              htmlFor="password"
              className="block text-sm font-medium text-grey-700"
              >
              Select Category  
              </label>
              <CategoryDropdown
              value={formik.values.category.label}
              onChange={formik.setFieldValue}
              onBlur = {formik.setFieldTouched}
              error = {formik.errors.category}
              touched = {formik.touched.category}
              />
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                {/* Description */}
                <textarea
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                ></textarea>
                {/* Err msg */}
                <div className="text-red-500">
                {formik.touched.description && formik.errors.description}
                </div>
                {/* Image component */}
                <label
              htmlFor="password"
              className="block text-sm font-medium mt-3 mb-2 text-grey-700"
              >
              Select Image to upload 
              </label>
               <Container className="container bg-grey-600">
               <div className="text-red-500">
                {formik.touched.image && formik.errors.image}
                </div>
               <Dropzone 
                onDrop={(acceptFiles)=>{
                  formik.setFieldValue('image',acceptFiles[0])
                }}
                accept={"image/*"}
                onBlur={formik.handleBlur("image")}>
                  {({getRootProps,getInputProps, open})=>{
                    return (
                      <div className="container">
                          <div {...getRootProps({className:'dropzone',
                          onDrop:(event)=>event.stopPropagation(),
                          })}>
                            <input {...getInputProps}
                            type="file"
                            className="cursor-pointer"
                            placeholder= 'Click to select image'
                            accept={"image/*"}
                            onChange={(event)=>
                              formik.setFieldValue('image',event.target.files[0])}
                            />
                          </div>
                          <p className="text-grey-300 text-lg cursor-pointer">
                          {formik.values.image ? 'Image is selected' : "Select Image.."}
                          </p>
                      </div>
                      
                    )
                  }}
                </Dropzone>
               </Container>

                
              </div>
              <div>
                {/* Submit btn */}
               {
                loading ? 
                <button
                disabled
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Loading...
              </button>
              :
              <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </button>
               }
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
