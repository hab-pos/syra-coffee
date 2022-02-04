"use strict";

module.exports.constants = Object.freeze({
  // HOST: "https://syra-sharafa.herokuapp.com/",
  // HOST : "https://us-central1-syra-sharafa.cloudfunctions.net/api/",
  // HOST: "http://localhost:8080/",
  // HOST : 'http://localhost:5001/syra-sharafa/us-central1/api/',
  HOST: 'http://192.168.0.24:5001/syra-sharafa/us-central1/api/',
  // HOST : 'http://192.168.43.191:5001/syra-sharafa/us-central1/api/',
  PORT: 8080,
  TIME_ZONE: "Europe/Madrid",
  GCSBUCKET: "syra bucker",
  GCLOUD_PROJECT: "syra-sharafa",
  GCLOUD_CLIENT_EMAIL: "syra-bucker@syra-sharafa.iam.gserviceaccount.com",
  GCLOUD_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC82xqYiQn4Iehg\nq5LU9rO3wl4Zv9gNNKjHYbbLpTYXS0yYjugjDrFRp61MBx/zTmvjk8Z5QU6vjlDf\nDYo/ffQBgskTBS+JHfzO69iWRqfLopOEN4kEaAslNji0QMM+fJ8unhfdUG8y3WmW\nGAOnL0HYzj0wxvA5c6dSwPeDxhnHlLxkR4N1hfBJvM6mJNOHWHvpmEmxYj+GUIeX\nNjp7oLGQ7RcbkywdIA+L0uQdJSMsyQXxTWOHUds+Ge6bYSCSzIhm30RsJpIjfR58\n1IOae5d/x7nEFFDJ6OiKQy0p3lVeMmmqn8s7fcneUjtDg27CPYJo7T8AF+uRGwzu\nLIgfAZe3AgMBAAECggEAR6Eu2DX58wQhWDEbMu0TQxpUiJ2r+25CqcTVCS5zcqhb\nt+1T/KAA/0CCyThWlPjkkN+mwqzThGCNKdy/188U8lHBpBYubmpSTcVEU9Mep2zV\nWKubq3Eu8QE8xpldtGCeG5dY49czJe62sngPQqT465tluA9sY84K46dO+cr0Ui7f\naXq+jBcMi0n5AXDYnBSASQReyAS8tjImEeEfSCmy5hUPbKTLOb6MorhkVdqGe/qc\nW+dj6PxDKDxkg+jEslPHqoUPiMXZ2wpoMuH3UyFMOJSAJbYwH9oBDk6edItwhmnR\npHjf1oxLUv98mMuwe26tNbFZ50INNl14BsO9GlD+qQKBgQDt5GM1pR3bBQf9xuQx\nwNJxSnKaRMlBmMnEOPSv5886KJfpw4Otdh6yQcSvjD+LDHFNF22107C4nHMhpKe1\nnr/vMXHMcVxhV6E6FB+ahZEJpeLcb20vUns5PM2s3v+H21gqdLTQogaI0KWhh6HL\nTXlgI9C3heB3FLm2nkhz9NkJKwKBgQDLOy+pKsieV+iQnOiOHZmIl7Rjlt6LEJXZ\nK7Jamib6Ry5TDSTdxyFEOrBxiHQDrtZf5OLHyPJHZ1qkjDhoS5MiGUXw3rYE1NY+\n9t8Cod75edwKjQ54v9a5bFal5wNfnO0CzfSTBNyLksTbzw4V8qXpBlq6fe9bmXJw\nin6AgjaNpQKBgFx4scPRijhvzTptjJh2bpcRLFkhMeYowQ1gYmTaQ+hEjUCV+mJ8\nDtSV0iG276BaVtRzrfbG8ePhFLPYMETeD5en7addzV4dVROhbOOA1e8dJ4EuYw/J\nDRMjuoNfL48cyTm/oeWThdy61hdjBJZlaC/h3CjqhmVjjgkZn+pLG+5/AoGAHQD4\nX1MsyHRRS3opMkcFJ1pHM0NPxVb7m7/Bt25yi5tnABFLJp+JntwlXD6WGAR2sb7P\noqWJ9ijI5dzhG/lVKTOkKKkQHwZlAR1oXE7PrJj4j0TsQM1YDqRohUq/z4Bszs6n\nzeeOthifIaOeJgG4LdZrUlwwscjnbSpGvX5X3MUCgYEApGYjHAI3/tRgIYH7k30v\ncRb2nQOGntYsOO3WjeVj1suhlzEXJS2B4oQIgSiIOPq7KCnv4iUbsEtcvD0dVOEK\niOMic4kKRBTQM77XTrdy7ipQBMhvZ39h4c4NmzN3e1a3JHsosJgl3cQqhvdtOruh\n8Z8Q6tot05RoVJf8Q3esHsc=\n-----END PRIVATE KEY-----\n"
});

exports.time_slot_hour = function () {
  var time_slot = [];
  time_slot[0] = "0 - 1";
  time_slot[1] = "1 - 2";
  time_slot[2] = "2 - 3";
  time_slot[3] = "3 - 4";
  time_slot[4] = "4 - 5";
  time_slot[5] = "5 - 6";
  time_slot[6] = "6 - 7";
  time_slot[7] = "7 - 8";
  time_slot[8] = "8 - 9";
  time_slot[9] = "9 - 10";
  time_slot[10] = "10 - 11";
  time_slot[11] = "11 - 12";
  time_slot[12] = "12 - 13";
  time_slot[13] = "13 - 14";
  time_slot[14] = "14 - 15";
  time_slot[15] = "15 - 16";
  time_slot[16] = "16 - 17";
  time_slot[17] = "17 - 18";
  time_slot[18] = "18 - 19";
  time_slot[19] = "19 - 20";
  time_slot[20] = "20 - 21";
  time_slot[21] = "21 - 22";
  time_slot[22] = "22 - 23";
  time_slot[23] = "23 - 24";
  return time_slot;
};