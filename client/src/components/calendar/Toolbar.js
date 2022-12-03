/* eslint-disable consistent-return */
import React from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { IoIosCreate } from 'react-icons/io';
import {
  BsCalendarDateFill,
  BsCalendarFill,
  BsCalendarMonthFill,
  BsCalendarWeekFill,
  BsFilter,
} from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import { Button, Dropdown } from 'flowbite-react';
import moment from 'moment';

const getIcon = (key) => {
  switch (key) {
    case 'year':
      return <BsCalendarFill />;
    case 'day':
      return <BsCalendarDateFill />;
    case 'month':
      return <BsCalendarMonthFill />;
    case 'week':
      return <BsCalendarWeekFill />;
    default:
      return <BsCalendarFill />;
  }
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'all' };
  }

  render() {
    const {
      localizer: { messages },
      label,
    } = this.props;
    return (
      <>
        <div className="flex md:flex-row flex-col-reverse justify-between items-center p-5 bg-orange-400 border-4 rounded-xl shadow-inner border-white">
          <div className="flex mt-2 flex-row justify-between justify-items-center items-center">
            <div className="flex flex-col w-1/2 justify-center justify-items-center">
              <Button
                onClick={() => {
                  this.props.setDates({
                    start: moment().toDate(),
                    end: moment()
                      .add(12, 'hours')
                      .toDate(),
                  });
                  this.props.setShow(true);
                }}
              >
                <IoIosCreate size={20} />
              </Button>
              <Dropdown arrowIcon={false} color="dark" label={<BsFilter size={20} />}>
                <Dropdown.Item
                  className={this.state.filter === 'all' && 'bg-green-500'}
                  onClick={() => this.filter('all')}
                >
                  All
                </Dropdown.Item>
                <Dropdown.Item
                  className={this.state.filter === 'task' && 'bg-green-500'}
                  onClick={() => this.filter('task')}
                >
                  Tasks
                </Dropdown.Item>
                <Dropdown.Item
                  className={this.state.filter === 'holiday' && 'bg-green-500'}
                  onClick={() => this.filter('holiday')}
                >
                  Holidays
                </Dropdown.Item>
                <Dropdown.Item
                  className={this.state.filter === 'reminder' && 'bg-green-500'}
                  onClick={() => this.filter('reminder')}
                >
                  Reminders
                </Dropdown.Item>
                <Dropdown.Item
                  className={this.state.filter === 'arrangement' && 'bg-green-500'}
                  onClick={() => this.filter('arrangement')}
                >
                  Arrangements
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="flex flex-col justify-center justify-items-center">
              <div className="flex flex-row">
                <Button
                  color="dark"
                  onClick={this.navigate.bind(null, navigate.PREVIOUS)}
                  className="rounded-r-none"
                >
                  <MdNavigateBefore size={20} />
                </Button>
                <Button
                  color="dark"
                  onClick={this.navigate.bind(null, navigate.TODAY)}
                  className="rounded-none"
                >
                  <AiFillHome size={20} />
                </Button>
                <Button
                  color="dark"
                  onClick={this.navigate.bind(null, navigate.NEXT)}
                  className="rounded-l-none"
                >
                  <MdNavigateNext size={20} />
                </Button>
              </div>
              <Dropdown
                label={
                  <span className="w-32">
                    {this.props.view.charAt(0).toUpperCase() + this.props.view.slice(1)}
                  </span>
                }
                color="dark"
                className="w-44 text-white"
              >
                {this.viewNamesGroup(messages).map((view) => (
                  <Dropdown.Item
                    className={`flex flex-row text-white ${
                      this.props.view.charAt(0).toUpperCase() + this.props.view.slice(1)
                      === view.props.children
                        ? 'bg-green-500'
                        : ''
                    } font-bold justify-between items-center`}
                    onClick={() => {
                      this.setState({ title: view.props.children });
                      view.props.onClick();
                    }}
                    key={view.key}
                  >
                    <span className="justify-center text-center w-36">{view.props.children}</span>
                    {getIcon(view.key)}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </div>
          <span className="text-white text-3xl font-bold text-center w-2/3">{label}</span>
        </div>
      </>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };

  filter = (type) => {
    this.setState({ filter: type });
    if (type === 'all') {
      return this.props.setEvents(this.props.events);
    }
    return this.props.setEvents(this.props.events.filter((event) => event.type === type));
  };

  view = (view) => {
    this.props.onView(view);
  };

  viewNamesGroup(messages) {
    const viewNames = this.props.views;

    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <button
          type="button"
          key={name}
          className="rbc-active"
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </button>
      ));
    }
  }
}

export default Toolbar;
