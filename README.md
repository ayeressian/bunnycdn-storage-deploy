# bunnycdn-storage-deploy

This action performs 3 operations.

- Uploads files and folders to storage.
- Removes all the files from storage.
- Purges pull zone.

Each operation can be activated with their respective upload, remove and purge flags.

## Inputs

### `upload`

It will upload files and folders if "true" provided. source, storageZoneName and storagePassword inputs should be provided.

### `remove`

It will remove all the files from storage before uploading if "true" provided. storageZoneName and storagePassword inputs should be provided.

### `purgePullZone`

It will purge the pull zone if "true" provided. pullZoneId and accessKey inputs should be provided.

### `purgePullZoneDelay`

Waits this many seconds before purging the pull zone in order to allow the storage zone time to replicate.

### `source`

The source directory that should be uploaded.

### `destination`

The destination directory that should be uploaded to in the bunny storage zone. (Example: www). The destination should _not_ have a trailing / as in www/.

If you want to upload files to a nested directory, you can specify the path to the directory in the destination parameter. For example, if you want to upload files to a directory called assets inside the www directory, you can set the destination parameter to www/assets.

Note that the nested directory will be automatically created by the CDN if it does not already exist.

### `storageZoneName`

The name of storage zone where you are connecting to.

### `storageEndpoint`

The storage endpoint. Default value is storage.bunnycdn.com

### `storagePassword`

The storage password. It should be read and write capable.

### `accessKey`

The API key.

### `pullZoneId`

Pull zone ID.

## Example usage

```
- name: Deploy to BunnyCDN
  uses: ayeressian/bunnycdn-storage-deploy@v2.4.0
  with:
    source: "dist"
    destination: "www"
    storageZoneName: "${{ secrets.STORAGE_NAME }}"
    storagePassword: "${{ secrets.STORAGE_PASSWORD }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
    pullZoneId: "${{ secrets.ZONE_ID }}"
    upload: "true"
    remove: "true"
    purgePullZone: "true"
    purgePullZoneDelay: "5"
```
