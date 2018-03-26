let war = {
  preload: function() {
  },
  create: function() {

  },
  update: function() {
    subIcons.forEach(subIcon => {
      subIcon.launches.forEach(launch => {
        if (launch.state === 'impossible') {
          // show a dialog that indicates out of ammo
          console.log('impossible');
        } else
        if (launch.state === 'exploded') {
          subIcon.launches.shift();
          console.log(subIcon.launches);
        } else {
          launch.update();
        }
      });
    });
  }
}
