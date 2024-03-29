import { username, password } from "./secrets";

export const RECEIVE_MEMES = "RECEIVE_MEMES";
export const NEW_MEMES = "NEW_MEMES";

function receiveMemes(json) {
  const { memes } = json.data;

  return {
    type: RECEIVE_MEMES,
    memes
  };
}

function fetchMemesJson() {
  return fetch("https://api.imgflip.com/get_memes").then(response =>
    response.json()
  );
}

export function fetchMemes() {
  return function(dispath) {
    return fetchMemesJson().then(json => dispath(receiveMemes(json)));
  };
}

function newMeme(meme) {
  return {
    type: NEW_MEMES,
    meme
  };
}

function postMemeJson(params) {
  params["username"] = username;
  params["password"] = password;

  const bodyParams = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");

  console.log("bodyParams", bodyParams);

  return fetch("https://api.imgflip.com/caption_image", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodyParams
  }).then(response => response.json());
}

export function createMeme(new_meme_object) {
  return function(dispatch) {
    return postMemeJson(new_meme_object).then(new_meme =>
      dispatch(newMeme(new_meme))
    );
  };
}
