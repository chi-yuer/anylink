// AnyLink 是一个企业级远程办公vpn软件，可以支持多人同时在线使用。

//go:build !windows
// +build !windows

package main

import (
	"embed"
	"os"
	"os/signal"
	"syscall"

	"github.com/chi-yuer/anylink/admin"
	"github.com/chi-yuer/anylink/base"
	"github.com/chi-yuer/anylink/handler"
)

//go:embed ui
var uiData embed.FS

// 程序版本
var CommitId string

func main() {
	base.CommitId = CommitId
	admin.UiData = uiData

	base.Start()
	handler.Start()

	signalWatch()
}

func signalWatch() {
	base.Info("Server pid: ", os.Getpid())

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM, syscall.SIGALRM, syscall.SIGUSR2)
	for {
		sig := <-sigs
		base.Info("Get signal:", sig)
		switch sig {
		case syscall.SIGUSR2:
			// reload
			base.Info("Reload")
		default:
			// stop
			base.Info("Stop")
			handler.Stop()
			return
		}
	}
}
