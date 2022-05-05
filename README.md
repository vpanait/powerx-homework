This project was bootstrapped using Node.js + TypeScript + Express

The task description can be found online at: https://powerxai.notion.site/Software-Engineer-c2d8095970d94e78a39f1abd86533939

## Getting Started

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode at [http://localhost:3000](http://localhost:3000).

The server will reload if you make edits.<br />
You will also see any lint or type errors in the console.

- How can we test the code to be confident in the implementation?
Unit testing - for this we need to have usually pure functions
Integration testing - i didnt do this, but as far as i read about it, consumers of the service write tests (based on publisher contracts). The publisher runs then when something changes. Basically that is how you find out if an integration will fail :)

- How can we make sure this code is easy to maintain for future developers?
* good file structure
* relevant comments 
* reuse as much code as possible (make it generic)

- Our API needs to be high-performance — how can we measure the performance of our API?
* use metrics like prometheus.io

- Would any of this logic need to change to scale to millions of simultaneous connections?
For this one i am thinking more at the infrastructure part. K8s as far as i know can do this kind of "magic" and spin off nodes as the current ones reach some thresholds 
