import React, {useState } from 'react';
import { Card, Button, Modal, ModalBody, Form, FormGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import basicUrl from './basicUrl';


const JobsComponent = (props) => {
  var jobs = props.jobs;
  var data = props.data;
  if (!props.user.recruiter) {

    for (let i = 0; i < props.data.length; i++) {
      jobs = props.jobs.filter(el => el._id !== props.data[i].job_id._id);
    }
  }
  else {
    for (let i = 0; i < jobs.length; i++) {
      data.push({
        job_Id:jobs[i]._id,
        'seekers':[]
      })
      fetch(basicUrl+'/jobs/' + jobs[i]._id, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
      }
      )
        .then(response => {
          if (response.ok) {
            return response;
          }
          else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
          }
        },
          error => {
            var errmess = new Error(error.message);
            throw errmess;
          })
        .then(response => response.json())
        .then(response => {
          data[i]['seekers'] = response;
        }
        )
    }
  }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const handleNewJob = (e) => {
      const job = { company: company, jp: jp, jd: jd }
      fetch(basicUrl + '/jobs',
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(job)
        })
        .then(response => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
          }
        },
          error => {
            throw error;
          })
      e.preventDefault();
      handleClose();
      props.update()
    }

    const [company, setCompany] = useState("")
    const [jp, setJp] = useState("")
    const [jd, setJd] = useState("")

    return (
      <>
        <div>
          <div className="row">
            {props.user.recruiter ? <Button className="mt-2 offset-8 col-2" variant="secondary" onClick={handleShow}>+ Add a Job</Button>
              :
              <AppliedJobs className="ml-15" data={data} />}
          </div>
          <RenderMyJobs jobs={jobs} data={data} recruiter={props.user.recruiter} update={props.update} />
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>Add a Job</Modal.Header>
          <ModalBody>
            <Form onSubmit={handleNewJob}>
              <FormGroup>
                <Form.Label htmlFor="jp">Job Profile</Form.Label>
                <Form.Control type="text" id="jp" name="jp"
                  value={jp}
                  onChange={e => setJp(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Form.Label htmlFor="company">Company</Form.Label>
                <Form.Control type="text" id="company" name="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Form.Label htmlFor="jd">Job Description</Form.Label>
                <Form.Control type="text" id="jd" name="jd"
                  value={jd}
                  onChange={e => setJd(e.target.value)} />
              </FormGroup>
              <Button type="submit" value="submit" color="primary">Add</Button>
            </Form>
          </ModalBody>
        </Modal>
      </>
    )
  }

  const RenderMyJobs = (props) => {
    const handleApply = (e, job) => {
      fetch(basicUrl + '/jobs/' + job._id,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(job)
        })
        .then(response => {
          if (response.ok) {
            return response;
          } else {
            if (response.message === "already applied") {
              console("Already Applied")
              return;
            }
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
          }
        },
          error => {
            throw error;
          })
      e.preventDefault();
      props.update();
    }
    
    const Jobs = props.jobs.map((job) => {
      return (
        <Card key={job._id} className="offset-1 col-10 mt-4">
          <Card.Body>
            <Card.Title>{job.jp}</Card.Title>
            <Card.Subtitle>{job.company}</Card.Subtitle>
            <Card.Text>
              {job.jd}
            </Card.Text>
            {props.recruiter ? <Applications data={props.data.filter(el=>el.job_Id===job._id)[0]} jobId={job._id}/> :
              <Button variant="primary" onClick={(e) => handleApply(e, job)} >Apply</Button>}
          </Card.Body>
        </Card>
      )
    })
    return (
      <div className="row">
        {Jobs}
      </div>
    )
  }

  const Applications = (props) => {
    if(props.data[seekers].length>0){
    const print = props.data['seekers'].map(seeker => {
      return (
        <Dropdown.Item id={seeker._id} href="#">{seeker.username}</Dropdown.Item>
      )
    })
  }
  else{
    const print = null
  }
    
    return (<DropdownButton id={props.jobId} title="Applications">
      {print}
    </DropdownButton>)
  }


  const AppliedJobs = (props) => {
    const appliedJobs = props.data.map(job => {
      return (
        <Dropdown.Item id={job.job_id._id} href="#">{job.job_id.jp} at {job.job_id.company}</Dropdown.Item>
      )
    })
    return (
      <DropdownButton title="Applied" className="offset-9">
        {appliedJobs}
      </DropdownButton>
    )
  }

  export default JobsComponent;