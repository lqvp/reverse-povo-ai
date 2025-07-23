import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const AccordianFooter = () => {
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
        >
          How do I return a watch if I am not satisfied?
        </AccordionSummary>
        <AccordionDetails>
          We offer a 30-day hassle-free return policy. If you&apos;re not
          completely satisfied with your purchase, please contact our customer
          support team for instructions on how to return your item and receive a
          refund.
          <br />
          <br />
          You can reach our customer support team through our contact page, by
          emailing support@circles.asia, or by calling our Customer Happiness
          number at +65 8742 1330 . Our team is available Mon-Fri: 8AM to 10PM
          and Sat-Sun & PH: 8AM to 6PM
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel2-header'
        >
          Do SmartValue Watches come with a warranty?
        </AccordionSummary>
        <AccordionDetails>
          Yes, all watches come with a one-year limited warranty covering
          manufacturing defects. Please refer to our warranty policy for more
          details.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel3-header'
        >
          Do you offer international shipping?
        </AccordionSummary>
        <AccordionDetails>
          Unfortunately no, we currently only offer local shipping within
          Singapore. But continue to keep an eye out for our updates and
          international shipping may be made available sooner than you might
          think!
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default AccordianFooter
