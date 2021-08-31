provider "google" {
  region = "${var.region}"
  zone   = "${var.zone}"
}

resource "google_pubsub_topic" "default-devicestatus" {
  name = "default-devicestatus"
}

resource "google_pubsub_topic" "default-telemetry" {
  name = "default-telemetry"
}

resource "google_cloudiot_registry" "default-registry" {
  name = "default-registry"

  event_notification_config = {
    pubsub_topic_name = "${google_pubsub_topic.default-devicestatus.id}"
  }

  state_notification_config = {
    pubsub_topic_name = "${google_pubsub_topic.default-telemetry.id}"
  }

  mqtt_config = {
    mqtt_enabled_state = "MQTT_ENABLED"
  }

  credentials = [
    {
      public_key_certificate = {
        format      = "X509_CERTIFICATE_PEM"
        certificate = "${file("${access_key}")}"
      }
    },
  ]
}
