import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "./newPostPage.scss";
import { API_URL } from "../../services/api";
import UploadWidget from "../../components/upload-widget/upload-widget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const editorContent = watch("desc");

  useEffect(() => {
    register("desc", { required: true });
  }, [register]);

  const onSubmit = async ({
    title,
    price,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    type,
    property,
    utilities,
    pet,
    income,
    size,
    school,
    bus,
    restaurant,
    desc,
  }) => {
    const formData = {
      postData: {
        title,
        price: Number(price),
        address,
        city,
        bedroom: Number(bedroom),
        bathroom: Number(bathroom),
        type,
        property,
        latitude,
        longitude,
        images,
      },
      postDetail: {
        desc,
        utilities,
        pet,
        income,
        size: Number(size),
        school: Number(school),
        bus: Number(bus),
        restaurant: Number(restaurant),
      },
    };

    try {
      const response = await API_URL.post("/posts", formData);
      navigate(`/${response.data.id}`);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const onTextEditorChange = (editor) => {
    setValue("desc", editor);
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="item-wrapper">
              <div className="item">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  {...register("title", { required: true })}
                />
                {errors.title && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  {...register("price", { required: true })}
                />
                {errors.price && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  {...register("address", { required: true })}
                />
                {errors.address && <span>This field is required</span>}
              </div>
              <div className="item description">
                <label htmlFor="desc">Description</label>
                <ReactQuill
                  theme="snow"
                  onChange={onTextEditorChange}
                  value={editorContent}
                />
                {errors.desc && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  {...register("city", { required: true })}
                />
                {errors.city && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="bedroom">Bedroom Number</label>
                <input
                  min={1}
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  {...register("bedroom", { required: true })}
                />
                {errors.bedroom && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="bathroom">Bathroom Number</label>
                <input
                  min={1}
                  id="bathroom"
                  name="bathroom"
                  type="number"
                  {...register("bathroom", { required: true })}
                />
                {errors.bathroom && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  {...register("latitude", { required: true })}
                />
                {errors.latitude && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  {...register("longitude", { required: true })}
                />
                {errors.longitude && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="type">Type</label>
                <select name="type" {...register("type", { required: true })}>
                  <option value="rent" defaultChecked>
                    Rent
                  </option>
                  <option value="buy">Buy</option>
                </select>
                {errors.type && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="type">Property</label>
                <select
                  name="property"
                  {...register("property", { required: true })}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
                {errors.property && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="utilities">Utilities Policy</label>
                <select
                  name="utilities"
                  {...register("utilities", { required: true })}
                >
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
                {errors.utilities && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="pet">Pet Policy</label>
                <select name="pet" {...register("pet", { required: true })}>
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
                {errors.pet && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="income">Income Policy</label>
                <input
                  id="income"
                  name="income"
                  type="text"
                  placeholder="Income Policy"
                  {...register("income", { required: true })}
                />
                {errors.income && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="size">Total Size (sqft)</label>
                <input
                  min={0}
                  id="size"
                  name="size"
                  type="number"
                  {...register("size", { required: true })}
                />
                {errors.size && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="school">School</label>
                <input
                  min={0}
                  id="school"
                  name="school"
                  type="number"
                  {...register("school", { required: true })}
                />
                {errors.school && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="bus">bus</label>
                <input
                  min={0}
                  id="bus"
                  name="bus"
                  type="number"
                  {...register("bus", { required: true })}
                />
                {errors.bus && <span>This field is required</span>}
              </div>
              <div className="item">
                <label htmlFor="restaurant">Restaurant</label>
                <input
                  min={0}
                  id="restaurant"
                  name="restaurant"
                  type="number"
                  {...register("restaurant", { required: true })}
                />
                {errors.restaurant && <span>This field is required</span>}
              </div>
            </div>
            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            cloudName: "dwtwuuy5u",
            uploadPreset: "map-estate",
            multiple: true,
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
