# bunnycdn-storage-deploy

This action deploys selected directory to BunnyCDN storage.

## Inputs

### `source`

**Required** The source directory folder.

### `storageZoneName`

**Required** The name of your storage zone where you are connecting to.

### `accessKey`

**Required** The storage API key.

### `pullZoneId`

Necessary for purgeing pull zone.

### `pullZoneAccessKey`

Necessary for purgeing pull zone.

### `purge`

It will purge the pull zone if true. pullZoneId and pullZoneAccessKey should be provided.

### `remove`

It will remove the files from storage before uploading if "true" provided.

## Example usage

```
- name: Deploy to BunnyCDN
  uses: ayeressian/bunnycdn-storage-deploy@v0.0.1
  with:
    source: "dist"
    storageZoneName: "${{ secrets.STORAGE_NAME }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
    pullZoneId: "${{ secrets.ZONE_ID }}"
    pullZoneAccessKey: "${{ secrets.PULL_ZONE_KEY }}"
    remove: "true"
    purge: "true"
```
