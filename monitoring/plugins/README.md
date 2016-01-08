# Plugins Directory
Plugins in use are defined in this directory.

To enable a plugin, create a JSON file with the following properties:

`my-plugin.json`:

```json
{
    "library": "plugin-name",
    "config": {}
}
```

If you provide an empty config `{}` then the default config for the plugin will be used. A merge is applied, so you can provide partial config properties, and the plugin will supply the rest. These values will be visible in the server log at start up.

## Example plugin
`sample.json`:

```json
{
  "library": "product-monitor-sample-plugin",
  "config": {
    "characters": "abcdefghiklmnopqrstuvwxyz",
    "minLength": 32,
    "maxLength": 64
  }
}
```

On start up, all plugin definitions will be loaded.
