set :application, "LifeTree"
set :node_file, "index.js"
set :host, "74.207.232.195"
set :repository, "git@github.com:Stanzr/LifeTree.git"
set :user, "roman"
set :admin_runner, "www-data"

set :scm, :git
set :branch, "master"
set :deploy_via, :remote_cache
set :deploy_to, "/var/www/#{application}"
set :keep_releases, 4

role :app, host

namespace :deploy do
  desc "Start application with forever"
  task :start, :roles => :app, :except => { :no_release => true } do
    run "forever start  #{current_path}/#{node_file}"
  end

  desc "Stop application"
  task :stop, :roles => :app, :except => { :no_release => true } do
    run "forever stop #{current_path}/#{node_file}"
  end

  desc "Restart application"
  task :restart, :roles => :app, :except => { :no_release => true } do
    stop
    sleep 1
    start
  end

  desc "Install npm modules"
  task :npm_install do
    run "cd #{release_path} && npm link"
  end

  desc "Update node_modules symlink"
  task :npm_update_symlink do
    run "rm -rf #{release_path}/node_modules"
    run "ln -s #{shared_path}/node_modules #{release_path}/node_modules"
  end

  desc "Update access to application"
  task :final_options, roles => :app do
    run "chown -R #{admin_runner}:#{admin_runner} #{deploy_to}"
    run "chmod 777 #{release_path}/cache"
  end

  task :symlink_configs, :roles => :app do
    %w[app_config.yml].each do |f|
      run "ln -sf #{shared_path}/config/#{f} #{release_path}/config/#{f}"
    end
  end

  desc "Create folders for nodejs application"
  task :setup_for_nodejs, :roles => :app do
    run "mkdir -p #{deploy_to}"
    run "mkdir -p #{shared_path}/node_modules"
    run "chown -R #{admin_runner}:#{admin_runner} #{deploy_to}"
  end

end

before 'deploy:setup', 'deploy:setup_for_nodejs'

after "deploy:finalize_update", "deploy:cleanup", "deploy:symlink_configs", "deploy:final_options"

after "deploy:update_code", "deploy:npm_update_symlink", "deploy:npm_install"
