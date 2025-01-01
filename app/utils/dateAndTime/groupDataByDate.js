const moment = require("moment");

// Function to group data by date categories and create history list

const groupDataByDate = (data) => {
  const groupedData = {
    pinned: [],
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    previousMonths: {}
  };

  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const lastWeekStart = moment().subtract(1, 'weeks').startOf('week');
  const lastMonthStart = moment().subtract(1, 'months').startOf('month');

  data.forEach(item => {
    if (item.pinned) {
      groupedData.pinned.push(item);
    } else {
      const itemDate = moment(item.date, ['hh:mm A', 'YYYY-MM-DD'], true);
      const itemDay = itemDate.clone().startOf('day');

      if (itemDay.isSame(today, 'd')) {
        groupedData.today.push(item);
      } else if (itemDay.isSame(yesterday, 'd')) {
        groupedData.yesterday.push(item);
      } else if (itemDay.isBetween(lastWeekStart, today)) {
        groupedData.lastWeek.push(item);
      } else if (itemDay.isBetween(lastMonthStart, lastWeekStart)) {
        groupedData.lastMonth.push(item);
      } else {
        const monthYear = itemDate.format('MMMM YYYY');
        if (!groupedData.previousMonths[monthYear]) {
          groupedData.previousMonths[monthYear] = [];
        }
        groupedData.previousMonths[monthYear].push(item);
      }
    }
  });

  const historyList = [];

  if (groupedData.pinned.length > 0) {
    historyList.push({
      title: 'Pinned',
      items: groupedData.pinned
    });
  }

  if (groupedData.today.length > 0) {
    historyList.push({
      title: 'Today',
      items: groupedData.today
    });
  }

  if (groupedData.yesterday.length > 0) {
    historyList.push({
      title: 'Yesterday',
      items: groupedData.yesterday
    });
  }

  if (groupedData.lastWeek.length > 0) {
    historyList.push({
      title: 'Last Week',
      items: groupedData.lastWeek
    });
  }

  if (groupedData.lastMonth.length > 0) {
    historyList.push({
      title: 'Last Month',
      items: groupedData.lastMonth
    });
  }

  for (const [month, items] of Object.entries(groupedData.previousMonths)) {
    historyList.push({
      title: month,
      items: items
    });
  }

  return historyList;
};

export default groupDataByDate;
