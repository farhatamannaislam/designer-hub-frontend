import { rest } from "msw";
const baseURL = "https://designerhubbackend-ebd8c03488fb.herokuapp.com/";
export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 5,
        username: "ema",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 5,
        profile_image: "https://res.cloudinary.com/dvpclsumk/image/upload/v1/media/../defaultprofile_tffswb"
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];