/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import React from 'react';
import moment from 'moment';

import { startOf, add } from 'react-big-calendar/lib/utils/dates';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import { Views } from 'react-big-calendar';

function createCalendar(currentDate) {
  if (!currentDate) {
    currentDate = moment();
  } else {
    currentDate = moment(currentDate);
  }

  const first = currentDate.clone().startOf('month');
  const last = currentDate.clone().endOf('month');
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week = [];
    calendar.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = currentDate.clone().set('date', day + 1 - first.day());
      date.calendar = calendar;
      week.push(date);
    }
  }

  return calendar;
}

function CalendarDate(props) {
  const { dateToRender, dateOfMonth } = props;
  const today = dateToRender.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'today' : '';

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button
      className={`date in-month ${today}`}
      style={(() => {
        if (new Date().toDateString() === new Date(props.dateToRender).toDateString()) return { backgroundColor: '#ccbe88' };
        if (
          props.events.find(
            (event) => new Date(event.start).toDateString() === new Date(props.dateToRender).toDateString(),
          )
        ) return { backgroundColor: 'rgb(64, 224, 208, 0.5)' };
        return {};
      })()}
      onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender.date()}
    </button>
  );
}

class Calendar extends React.Component {
  state = {
    calendar: undefined,
  };

  componentDidMount() {
    this.setState({ calendar: createCalendar(this.props.date) });
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ calendar: createCalendar(this.props.date) });
    }
  }

  render() {
    if (!this.state.calendar) {
      return null;
    }

    return (
      <div className="month">
        <div className="month-name">
          {this.state.calendar.currentDate.format('MMMM').toUpperCase()}
        </div>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={index} className="day">
            {day}
          </span>
        ))}
        {this.state.calendar.map((week, index) => (
          <div key={index}>
            {week.map((date) => (
              <CalendarDate
                events={this.props.events}
                key={date.date()}
                dateToRender={date}
                dateOfMonth={this.state.calendar.currentDate}
                onClick={(date) => {
                  this.props.onView(Views.DAY);
                  this.props.onNavigate(date);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

class Year extends React.Component {
  render() {
    const { date, ...props } = this.props;
    const { onView, onNavigate } = this.props.components;
    const range = Year.range(date);
    const months = [];
    const firstMonth = startOf(date, 'year');

    for (let i = 0; i < 12; i++) {
      months.push(
        <Calendar
          events={this.props.events}
          onView={onView}
          onNavigate={onNavigate}
          key={i + 1}
          date={add(firstMonth, i, 'month')}
        />,
      );
    }

    return <div className="year overflow-auto p-5">{months.map((month) => month)}</div>;
  }
}

// Day.propTypes = {
//   date: PropTypes.instanceOf(Date).isRequired,
// }

Year.range = (date) => [startOf(date, 'year')];

Year.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return add(date, -1, 'year');

    case navigate.NEXT:
      return add(date, 1, 'year');

    default:
      return date;
  }
};

Year.title = (date, { localizer }) => localizer.format(date, 'yearHeaderFormat');

export default Year;
