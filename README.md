# bunnycdn-storage-deploy


This repo contains 4 actions:

1. Storage-Deploy - Which is handy for uploading and removing previous files.
2. Storage Create - Which can create a new Bunny storage.
3. Pull Zone Update - Which can update a Bunny pull zone to fetch data from a different storage zone.
4. Pull Zone Purge - Which can purge a Bunny pull zone.
5. Storage Remove - Which can delete similiar named storage zones only keeping the latest x number of storage zones.

## 1. Storage-Deploy

This action performs 3 operations.
* Uploads files and folders to storage.
* Removes all the files from storage.
* Purges pull zone.

Each operation can be activated with their respective upload, remove and purge flags.

### Inputs

It will upload files and folders if "true" provided. source, storageZoneName and storagePassword inputs should be provided.

| Name | Description |
| --- | --- |
| `upload` | It will upload files and folders if "true" provided. source, storageZoneName and storagePassword inputs should be provided. |
| `remove` | It will remove all the files from storage before uploading if "true" provided. storageZoneName and storagePassword inputs should be provided. |
| `purgePullZone` | It will purge the pull zone if "true" provided. pullZoneId and accessKey inputs should be provided. |
| `source` | The source directory that should be uploaded. |
| `destination` | The destination directory that should be uploaded to in the bunny storage zone. (Example: www). The destination should *not* have a trailing / as in www/.

If you want to upload files to a nested directory, you can specify the path to the directory in the destination parameter. For example, if you want to upload files to a directory called assets inside the www directory, you can set the destination parameter to www/assets.

Note that the nested directory will be automatically created by the CDN if it does not already exist. |
| `storageZoneName` | The name of storage zone where you are connecting to. |
| `storageEndpoint` | The storage endpoint. Default value is storage.bunnycdn.com |
| `storagePassword` | The storage password. It should be read and write capable. |
| `accessKey` | The API key. |
| `pullZoneId` | Pull zone ID. |

```
- name: Deploy to BunnyCDN
  uses: ayeressian/bunnycdn-storage-deploy@v2.2.0
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

## 2. Storage Create

This actions creates a new bunny storage zone. It also returns an output which can be used in other github actions.

### Inputs

| Name | Description |
| --- | --- |
| `name` | The name of the storage zone. |
| `region` | The code of the main storage zone region (Possible values: DE, NY, LA, SG). |
| `replicationRegions` | The code of the main storage zone region (Possible values: DE, NY, LA, SG, SYD). Values should be separated by comma. Take care not to include the region. |
| `zoneTier` | The zone tier (0 = Standard, 1 = Edge). |
| `accessKey` | The API key. |

### Outputs

| Name | Description |
| --- | --- |
| `storageZoneId` | The storage zone id. |
| `storageZoneName` | The storage zone name. |
| `storageZonePassword` | The storage password. It should be read and write capable. |

### Example usage

```
- name: Create storage in BunnyCDN
  id: createStorage
  uses: ayeressian/bunnycdn-storage-deploy/createStorage@v2.1.1
  with:
    name: new-storage
    region: DE
    replicationRegions: DE,LA
    zoneTier: 1
    accessKey: "${{ secrets.STORAGE_KEY }}"
```

The output can be used in the next job using: ${{ steps.createStorage.outputs.storageZonePassword }}

## 3. Pull Zone Update

Github actions that can update an existing pull zone to use a different storage zone.

### Inputs

| Name | Description |
| --- | --- |
| `pullZoneId` | The pull zone id. |
| `storageZoneId` | The new storage zone id. |
| `accessKey` | The API key. |

### Example usage

```
- name: Update pull zone with a different storage zone
  uses: ayeressian/bunnycdn-storage-deploy/pullZoneChangeStorage@v2.1.1
  with:
    pullZoneId: "${{ secrets.ZONE_ID }}"
    storageZoneId: "${{ steps.createStorage.outputs.storageZoneId }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
```

## 4. Pull Zone Purge

Github actions that can purge a Bunny pull zone.

### Inputs

| Name | Description |
| --- | --- |
| `pullZoneId` | The pull zone id. |
| `accessKey` | The API key. |

### Example usage

```
- name: Purge the pull zone 
  uses: ayeressian/bunnycdn-storage-deploy/purge@v2.1.1
  with:
    pullZoneId: "${{ secrets.ZONE_ID }}"
    accessKey: "${{ secrets.STORAGE_KEY }}"
```

## 5. Storage Remove

Github actions that can remove old storage zones using a `startsWith` filter. Useful when creating a new storage zone for each new release. 

Example: Having created 4 storage zones: `frontend-v1.0.0`, `frontend-v1.0.1`, `frontend-v1.0.2`, `frontend-v1.0.3`. This actions can be used to remove the two old releases by specifying the parameters startsWith=frontend-v and keepLast=2. 

### Inputs

| Name | Description |
| --- | --- |
| `startsWith` | The name the storage zones should start with. |
| `keepLast` | The number of storage zones to keep. |
| `dryMode` | If dry mode is true no storage zones will be deleted. Good for testing.  |
| `accessKey` | The API key. |

### Example usage

```
- name: Remove old storage zones
  uses: ayeressian/bunnycdn-storage-deploy/removeOldStorageZones@v2.1.1
  with:
    startsWith: production-www-v
    keepLast: 3
    dryMode: true
    accessKey: "${{ secrets.STORAGE_KEY }}"
```