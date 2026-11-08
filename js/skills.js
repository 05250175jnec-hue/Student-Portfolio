// Skills section: tab groups with animated progress meters.
(() => {
  // [label, level in %, colour variable]
  const SKILLS = {
    Networking: [
      ['LAN and IP addressing', 80, '--blue'],
      ['Routing and switching', 70, '--blue'],
      ['Cisco Packet Tracer', 75, '--blue'],
      ['Troubleshooting', 75, '--blue'],
    ],
    'Systems and code': [
      ['Linux administration', 75, '--green'],
      ['Windows', 70, '--green'],
      ['Python and Tkinter', 65, '--green'],
      ['HTML and CSS', 75, '--green'],
      ['JavaScript', 65, '--green'],
      ['Full-stack web development', 60, '--green'],
    ],
    Personal: [
      ['Problem-solving', 80, '--red'],
      ['Teamwork', 85, '--red'],
      ['Communication', 75, '--red'],
      ['Quick learning', 90, '--red'],
    ],
  };

  const tabList = $('#tabs');
  const grid = $('#skillGrid');

  function skillCard([name, level, color]) {
    return (
      '<div class="skill">' +
      `<div><span>${name}</span><span>${level}%</span></div>` +
      `<div class="meter"><i style="--c:var(${color})" data-width="${level}"></i></div>` +
      '</div>'
    );
  }

  function showGroup(group) {
    tabList.querySelectorAll('.tab').forEach((tab) => {
      tab.setAttribute('aria-selected', tab.textContent === group);
    });
    grid.innerHTML = SKILLS[group].map(skillCard).join('');

    // Wait two frames so the meters animate from 0 to their level.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        grid.querySelectorAll('i').forEach((bar) => {
          bar.style.width = bar.dataset.width + '%';
        });
      })
    );
  }

  Object.keys(SKILLS).forEach((group) => {
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.setAttribute('role', 'tab');
    tab.textContent = group;
    tab.onclick = () => showGroup(group);
    tabList.append(tab);
  });

  showGroup('Networking');
})();
