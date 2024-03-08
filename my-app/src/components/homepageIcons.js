import { Col, Row } from "react-bootstrap";
import { SiUnitednations } from "react-icons/si";
import { GiWorld } from "react-icons/gi";
import { MdFamilyRestroom } from "react-icons/md";

function HomePageIcons() {
    // this file shows 3 columns with icons and text in it to let the users know the facts
    return ( 
        <Row className="homeIconsRow">
                <Col>
                <SiUnitednations className="homeIcon" />
                <h5 className="homeIconText">
                UN’s goals of “End poverty in all forms everywhere”
                </h5>
                </Col>
                <Col>
                <GiWorld className="homeIcon"/>
                <h5 className="homeIconText">In Northern Ireland alone there are “330,000 people in poverty”, this equates to 190,000 working-age adults, 110,000 children and 30,000 pensioners</h5>
                </Col>
                <Col>
                <MdFamilyRestroom className="homeIcon"/>
                <h5 className="homeIconText">Cost of living crisis taking a grave impact on Northen Irish families, leaving 1 in 5 in poverty</h5>
                </Col>
            </Row>
     );
}

export default HomePageIcons;