import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalBody, Form, FormGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import basicUrl from './basicUrl';


const JobsComponent = (props) => {


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
            <AppliedJobs className="ml-15" data={props.data} />}
        </div>
        <RenderMyJobs jobs={props.jobs} recruiter={props.user.recruiter} />
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
    const handleApply=(e,job)=>{
      fetch(basicUrl + '/jobs/'+job._id,
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
          {props.recruiter ? <Applications job={job} /> :
            <Button variant="primary" onClick={(e)=>handleApply(e,job)} >Apply</Button>}
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

const Applications = ({ job }) => {
  var data=[];
  fetch(basicUrl + '/jobs/' + job._id, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
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
    .then(response => response.json())
    .then(response => {
      data = data
    }
    );

  
  const seekers = data.map(seeker => {
    return (
      <Dropdown.Item id={seeker._id} href="#">{seeker.name}</Dropdown.Item>
    )
  }
  )
  console.log(seekers)
  return (<DropdownButton id={job._id} title="Applications">
    {seekers}
  </DropdownButton>)
}


const AppliedJobs = (props) => {
  const appliedJobs = props.data.map(job => {
    return (
      <Dropdown.Item id={job._id} href="#">{job.jp}+"at"+{job.company}</Dropdown.Item>
    )
  })
  return (
    <DropdownButton title="Applied">
      {appliedJobs}
    </DropdownButton>
  )
}

export default JobsComponent;