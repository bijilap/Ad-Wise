# Welcome Hackers!
This is a sample [AngluarJS](https://angularjs.org/) application to get you up and running using Watchwith data as quickly as possible. If you have any questions, please stop by our table or find us on [#Slack](https://nbcuhackathon.slack.com/archives/watchwith), we're here to help!

## Building & Running
The sample application relies on [Node.js](https://www.npmjs.com/), [npm](https://www.npmjs.com/) and [Gulp](http://gulpjs.com/) to build and serve locally. 

Once you have this repository checked out from git locally run `npm install`:
```
user@machine:~/git/nbcu-hackathon$ npm install
```
You may see a few warning messages but there shold be no fatal errors.

With the [gulp-cli](https://www.npmjs.com/package/gulp-cli) installed, you can build the project and load it on a local server by just running `gulp` in the project directory:

```
user@machine:~/git/nbcu-hackathon$ gulp
[13:22:29] Using gulpfile ~/git/nbcu-hackathon/gulpfile.js
[13:22:29] Starting 'styles'...
[13:22:29] Starting 'pages'...
[13:22:29] Finished 'pages' after 21 ms
[13:22:29] Starting 'static'...
[13:22:29] Starting 'modules'...
[13:22:29] Starting 'templates'...
[13:22:29] Starting 'watch'...
[13:22:29] Finished 'watch' after 29 ms
[13:22:29] Starting 'serve'...
[13:22:29] Finished 'serve' after 2.3 ms
[13:22:29] Server started at http://:::3000
[13:22:29] Finished 'styles' after 171 ms
[13:22:29] Finished 'static' after 195 ms
[13:22:29] Finished 'templates' after 209 ms
[13:22:29] Finished 'modules' after 225 ms
[13:22:29] Starting 'project'...
[13:22:29] Finished 'project' after 7.41 ms
[13:22:29] Starting 'build'...
[13:22:29] Finished 'build' after 7.73 μs
[13:22:29] Starting 'default'...
```
Open your browser and load [http://localhost:3000/](http://localhost:3000/) to view the project.  Use `ctrl+C` to shutdown the server.

## Developing
This sample project generates a set of HTML files that load videos with sample Watchwith Airings \(aka timelines\).  These Airings contain Events that have metadata associated with a period of time in the video (e.g. from `00:00:30` to `00:01:45`).  The metadata in these Events can contain just about anything, for these samples we have provided Message and Promo events to illustrate some of the possibilities.  The sample project has links to the JSON data and [here is the Airing for the Saturday Night Live Cowbell skit](http://api.watchwith.com/v3/airings/2887db10-a262-422b-9122-88a5606399bc?key=57N2COBYPGA).

### Templates & Stylesheets
The Watchwith client framework is responsible for displaying events at the correct time.  The templates that control the layout of events can be found in the [src/templates](src/templates) directory.  In particular the [message-template.html](src/templates/message/message-template.html) shows a custom template that handles Message events and the [default-template.html](src/templates/item/default-template.html). All of the [data in the JSON feeds](http://api.watchwith.com/v3/airings/2887db10-a262-422b-9122-88a5606399bc?key=57N2COBYPGA) are available for you to use in the templates. These are just [Angular Templates](https://docs.angularjs.org/tutorial/step_02) but if you're not familiar with them, [just hit us up on #Slack](https://nbcuhackathon.slack.com/archives/watchwith) and we'll help you get set up.

The sample project uses [Sass](http://sass-lang.com/) to generate the Cascading Stylesheets that control the appearance of the application.  The Sass files end with the `.scss` extension and can be found in [src/styles](src/styles).  All the files in that directory are combined into a single file called `watchwith.css` that is included on the sample video pages.  If you're not familiar with Sass, don't worry you can put regular CSS in those files and it will be handled properly.

### Directives
Interactive functionality can be added by creating custom [directives](https://code.angularjs.org/1.4.9/docs/guide/directive). We have a lot of experience writing them and will be happy to help guide you, stop by or send us a note on [#Slack](https://nbcuhackathon.slack.com/archives/watchwith). There is an example promo directive in the sample project: [promo-item-directive.js](src/modules/promo/promo-item-directive.js)

## Content 
The content provided in the sample project is just meant to be sample data.  Watchwith team members will be on-site to help you with your content needs.  We can help you create the content you need or give you the tools to create the content yourselves.  Find us on [#Slack](https://nbcuhackathon.slack.com/archives/watchwith) or stop by our table, we're happy to help!

## Gulp and the Project Layout
The Gulp tasks for the sample project can be found in [gulpfile.js](gulpfile.js). The default task will build the project, start a server and watch for file changes.  When files are changed they will be rebuilt so you can review the changes right away.  The following table summarizes the tasks available.

| Gulp Command | Actions |
| --- | --- |
| gulp | Compiles the Javascript, HTML and Sass files, stores them in the [build](build) directory, starts a local server at [http://localhost:3000](http://localhost:3000) and watches the files for any changes. |
| gulp dist | Creates a `dist` directory with all of the contents need to run the application. |
| gulp clean | Deletes the `build` and `dist` directories. |
