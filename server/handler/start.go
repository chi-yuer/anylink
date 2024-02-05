package handler

import (
	"crypto/sha1"
	"encoding/hex"
	"os"

	"github.com/chi-yuer/anylink/admin"
	"github.com/chi-yuer/anylink/base"
	"github.com/chi-yuer/anylink/cron"
	"github.com/chi-yuer/anylink/dbdata"
	"github.com/chi-yuer/anylink/sessdata"
)

func Start() {
	dbdata.Start()
	sessdata.Start()
	cron.Start()

	switch base.Cfg.LinkMode {
	case base.LinkModeTUN:
		checkTun()
	case base.LinkModeTAP:
		checkTap()
	case base.LinkModeMacvtap:
		checkMacvtap()
	default:
		base.Fatal("LinkMode is err")
	}

	// 计算profile.xml的hash
	b, err := os.ReadFile(base.Cfg.Profile)
	if err != nil {
		panic(err)
	}
	ha := sha1.Sum(b)
	profileHash = hex.EncodeToString(ha[:])

	go admin.StartAdmin()
	go startTls()
	go startDtls()

	go logAuditBatch()
}

func Stop() {
	_ = dbdata.Stop()
	destroyVtap()
}
