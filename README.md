# bunnycdn-storage-deploy

This action performs 3 operations.
* Uploads files and folders to storage.
* Removes all the files from storage.
* Purges pull zone.

Each operation can be activated with their respective upload, remove and purge flags.

## Inputs

### `upload`

It will upload files and folders if "true" provided. source, storageZoneName and storagePassword inputs should be provided.

### `remove`

It will remove all the files from storage before uploading if "true" provided. storageZoneName and storagePassword inputs should be provided.

### `purgePullZone`

It will purge the pull zone if "true" provided. pullZoneId and accessKey inputs should be provided.

### `source`

The source directory that should be uploaded.

### `destination`

The destination directory that should be uploaded too in the bunny storage zone. (Example: www).
The destination should not end with `/` as in `www/`.

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
  uses: ayeressian/bunnycdn-storage-deploy@v2.1.1
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
```
