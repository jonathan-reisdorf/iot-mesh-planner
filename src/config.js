export const APPLICATION_VERSION = '1.0.0';

export const ICONS = {
  door_window_sensor: 'Door / Window Sensor',
  ethernet_socket: 'Ethernet Socket',
  ethernet_switch: 'Ethernet Hub / Switch',
  generic: 'Generic Device',
  hub: 'Hub',
  light: 'Light',
  motion_sensor: 'Motion Sensor',
  plug_socket: 'Plug Socket',
  smoke_detector: 'Smoke Detector',
  switch: 'Switch',
  temperature_sensor: 'Temperature Sensor'
};

export const NODES = [
  {
    type: 'plug_socket',
    title: 'Plug Socket',
    icon: 'plug_socket',
    smart: false,
    extension: false
  },
  {
    type: 'plug_socket_smart',
    title: 'Smart Plug Socket',
    icon: 'plug_socket',
    smart: 'active',
    extension: true
  },
  {
    type: 'switch',
    title: 'Switch',
    icon: 'switch',
    smart: false,
    extension: false
  },
  {
    type: 'switch_smart',
    title: 'Smart Switch',
    icon: 'switch',
    smart: 'active',
    extension: true
  },
  {
    type: 'light',
    title: 'Light',
    icon: 'light',
    smart: false,
    extension: false
  },
  {
    type: 'light_smart',
    title: 'Smart Light',
    icon: 'light',
    smart: 'active',
    extension: true
  },
  {
    type: 'ethernet_socket',
    title: 'Ethernet Socket',
    icon: 'ethernet_socket',
    smart: false,
    extension: false
  },
  {
    type: 'ethernet_switch',
    title: 'Ethernet Hub / Switch',
    icon: 'ethernet_switch',
    smart: false,
    extension: false
  },
  {
    type: 'smart_hub',
    title: 'Smart Hub',
    icon: 'hub',
    smart: 'hub',
    extension: false
  },
  {
    type: 'door_window_sensor',
    title: 'Door / Window Sensor',
    icon: 'door_window_sensor',
    smart: 'passive',
    extension: false
  },
  {
    type: 'motion_sensor',
    title: 'Motion Sensor',
    icon: 'motion_sensor',
    smart: 'passive',
    extension: false
  },
  {
    type: 'temperature_sensor',
    title: 'Temperature Sensor',
    icon: 'temperature_sensor',
    smart: 'passive',
    extension: false
  },
  {
    type: 'smoke_detector',
    title: 'Smoke Detector',
    icon: 'smoke_detector',
    smart: false,
    extension: false
  },
  {
    type: 'smoke_detector_smart',
    title: 'Smart Smoke Detector',
    icon: 'smoke_detector',
    smart: 'passive',
    extension: false
  },
  {
    type: 'generic',
    title: 'Generic Device',
    icon: 'generic',
    smart: false,
    extension: false
  },
  {
    type: 'smart_generic',
    title: 'Generic Smart Device',
    icon: 'generic',
    smart: 'active',
    extension: true
  }
];

export const DEFAULT_SIGNAL_STRENGTH_PASSIVE = 30;
export const DEFAULT_SIGNAL_STRENGTH_ACTIVE = 35;

export const NODES_START_MOVING_TIMEOUT = 200;

export const PLAN_MOVE_THRESHOLD = 10;
export const PLAN_MOVE_TIMEOUT = 300;
