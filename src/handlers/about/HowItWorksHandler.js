import React, {Component} from 'react';

export default class HowItWorksHandler extends Component {

  render() {
    return (
      <div id="how-it-works-handler">
        <div className="container what-is">
          <h1>What is Nelper?</h1>
          <p>
            Nelper is a simple and trusted community marketplace to connect with
            people around you and either have your tasks completed or complete other
            people’s tasks, for money.
          </p>
        </div>
        <div className="dark-section buttons-section">
          <div className="container pad-hor">
            <div className="section-col-3">
              <button className="dark-big">Find Nelp</button>
              <div className="desc">Find Nelp and get your tasks completed!</div>
            </div>
            <div className="section-col-3">
              <img className="logo" src={require('images/logo-round.png')} />
            </div>
            <div className="section-col-3">
              <button className="dark-big">Nelp</button>
              <div className="desc">Become a Nelper by completing posted tasks!</div>
            </div>
          </div>
        </div>
        <div className="container pad-extra">
          <h2>Find Nelp</h2>
          <div className="info-row">
            <div className="info-image">
              <img src={require('images/how-it-works/find-nelp-1.png')} />
            </div>
            <div className="info-desc">
              <h3>Post your Task in Find Nelp!</h3>
              <p>
                Get any tasks completed! Get started by clicking on Ask for Nelp,
                select your task category and enter a title with a brief description.
                Include the price you are looking for, add pictures and you are done!
              </p>
            </div>
          </div>
          <div className="info-row">
            <div className="info-desc">
              <h3>Choose the Nelper you want from the list of applicants</h3>
              <p>
                Interested Nelpers make a price offer and apply for your task.
                Discuss the details and requirements of the task with them and make
                your choice based on their skills & feedback, which can be found
                on their profile!
              </p>
            </div>
            <div className="info-image">
              <img src={require('images/how-it-works/find-nelp-2.png')} />
            </div>
          </div>
          <div className="info-row">
            <div className="info-image">
              <img src={require('images/how-it-works/find-nelp-3.png')} />
            </div>
            <div className="info-desc">
              <h3>Add funds using our safe and trusted NelperPay system</h3>
              <p>
                Once you accept an offer from a Nelper to complete your task, you
                will be asked to add funds via NelperPay, which will be held securel
                until the task has been completed. This way, the Nelper can work on
                your task safely knowing the funds are secured for them.
              </p>
            </div>
          </div>
          <div className="info-row">
            <div className="info-desc">
              <h3>Complete the transaction and rate the Nelper</h3>
              <p>
                Once the task has been completed and both parties are satisfied,
                the Nelper will request their payment. You then get a notification
                and are able to release the funds via NelperPay.
              </p>
              <p>
                As a final step, you are asked to rate the Nelper based on your
                satisfaction, which concludes the transaction.
              </p>
            </div>
            <div className="info-image">
              <img src={require('images/how-it-works/find-nelp-4.png')} />
            </div>
          </div>
        </div>
        <div className="dark-section">
          <div className="container">
            <h2>Get Started Now!</h2>
            <button className="primary">Ask for Nelp</button>
          </div>
        </div>
        <div className="container pad-extra">
          <h2>Nelp</h2>
          <div>
            <img />
            <div>
              <h3>Set up your profile</h3>
              <p>
                Click on the profile section and start setting up your info. Write
                about yourself, your skills and school/work experience. Completing
                this step will allow users to know about you before accepting your application.
              </p>
              <p>
                You can also add your location to enable proximity browsing.
              </p>
            </div>
          </div>
          <div>
            <div>
              <h3>Browse tasks in Nelp</h3>
              <p>
                To become a Nelper, start by browsing through tasks in Nelp and
                find the one that suits you best. You can browse by desired categories,
                price or proximity.
              </p>
            </div>
            <img />
          </div>
          <div>
            <img />
            <div>
              <h3>Select the task you want to complete</h3>
              <p>
                Once you find a task that suits you, apply for it. You can either
                apply for the price that was offered or counter offer for a price
                you think is fair.
              </p>
              <p>
                You can also include a note as to how you are qualified for the task.*
              </p>
            </div>
          </div>
          <div>
            <div>
              <h3>Get paid</h3>
              <p>
                Once you have completed the task and both parties are satisfied,
                select Request Payment. This can be done directly on the task,
                under Active Tasks, in your Profile.
              </p>
              <p>
                The Nelp poster will be notified to release the funds. Once it’s
                done, they will be safely transferred into your verified bank account.
              </p>
            </div>
            <img />
          </div>
        </div>
      </div>
    );
  }
}
