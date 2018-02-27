# Blackboard Question Pools to Canvas Question Banks

- Input: Blackboard Question Pool Export XML File (res00002.data)
- Converts it to usable JSON
- Downloads all images found in the question pools
- Uploads images to Canvas
- Updates questions with new Canvas links
- Creates question bank in Canvas
- Create questions in question bank

### Usage

> npm i

> npm run build

> node src/main.js -c QUESTION_POOL_CONFIG_FILE_LOCATION

### Configurations

Environment Config:

Create a file config/default.json with the following structure and your data.

```
{
  "bb": {
    "domain": "https://[YOUR Blackboard DOMAIN]/bbcswebdav/",
    "login": "[Blackboard LOGIN URL]",
    "user": {
      "name": "[YOUR USERNAME]",
      "pw": "[YOUR PASSWORD]"
    }
  },
  "canvas": {
    "domain": "https://[YOUR Canvas DOMAIN]/",
    "token": "[YOUR INTEGRATION TOKEN]",
    "loginInfo": {
      "credentials": {
        "username": "[YOUR USERNAME]",
        "password": "[YOUR PASSWORD]"
      },
      "url": "[Canvas LOGIN URL]",
      "expectedLanding": "[Canvas REDIRECT AFTER LOGIN]",
      "selectors": {
        "username": "[CSS Selector for username input]",
        "password": "[CSS Selector for password input]",
        "loginButton": "[CSS Selector for submit button]"
      }
    }
  }
}
```

Sample question pool config:

```
{
  "courseId": 1,
  "inputFile": "./data/quiz01/input.xml",
  "outputFile": "./data/quiz01/output.json",
  "questionBankTitle": "Quiz 01",
  "downloadFolder": "./data/quiz01/",
  "uploadFolder": "Quiz Images/Quiz 01"
}
```
