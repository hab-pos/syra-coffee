"use strict";

var util = require('util');

var _require = require("@google-cloud/storage"),
    Storage = _require.Storage;

var _require2 = require('../../Utils/constants'),
    constants = _require2.constants;
/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */


module.exports.uploadImage = function (file) {
  return new Promise(function (resolve, reject) {// const storage = new Storage({ projectId: constants.GCLOUD_PROJECT, credentials: { client_email: constants.GCLOUD_CLIENT_EMAIL, private_key: constants.GCLOUD_PRIVATE_KEY } })
    // const bucket = storage.bucket(constants.GCSBUCKET)
    // console.log(file)
    // const { originalname, buffer } = file
    // const blob = bucket.file(originalname.replace(/ /g, "_"))
    // const blobStream = blob.createWriteStream({
    //     resumable: false
    // })
    // blobStream.on('finish', () => {
    //     const publicUrl = format(
    //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    //     )
    //     resolve(publicUrl)
    // })
    //     .on('error', () => {
    //         reject(`Unable to upload image, something went wrong`)
    //     })
    //     .end(buffer)
  });
};