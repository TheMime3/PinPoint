require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'PinPointLaunchMonitor'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = { :type => 'MIT' }
  s.author         = 'PinPoint'
  s.homepage       = 'https://github.com/TheMime3/PinPoint'
  s.platforms      = { :ios => '16.4' }
  s.source         = { :git => 'https://github.com/TheMime3/PinPoint.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'AVFoundation', 'CoreMotion', 'Accelerate'
  s.source_files = 'ios/**/*.{h,m,mm,swift}'
end
