import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

class AIAnalysisService {
  constructor() {
    this.detector = null;
    this.isInitialized = false;
    this.analysisHistory = [];
  }

  // Initialize TensorFlow.js and pose detection model
  async initialize() {
    try {
      console.log('Initializing AI Analysis Service...');
      
      // Ensure TensorFlow backend is ready
      await tf.ready();
      
      // Create pose detector
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true,
          multiPoseMaxDimension: 256,
        }
      );
      
      this.isInitialized = true;
      console.log('AI Analysis Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Analysis Service:', error);
      return false;
    }
  }

  // Analyze video frame for pose and movement
  async analyzeFrame(videoElement) {
    if (!this.isInitialized || !this.detector) {
      throw new Error('AI Analysis Service not initialized');
    }

    try {
      const poses = await this.detector.estimatePoses(videoElement);
      if (poses.length === 0) {
        return null;
      }

      const pose = poses[0];
      const analysis = this.extractIceDanceMetrics(pose);
      
      return {
        timestamp: Date.now(),
        pose: pose,
        analysis: analysis,
        confidence: pose.score || 0
      };
    } catch (error) {
      console.error('Frame analysis failed:', error);
      return null;
    }
  }

  // Extract ice dance specific metrics from pose data
  extractIceDanceMetrics(pose) {
    const keypoints = pose.keypoints;
    const metrics = {
      balance: this.calculateBalance(keypoints),
      posture: this.analyzePosture(keypoints),
      armPosition: this.analyzeArmPosition(keypoints),
      legExtension: this.analyzeLegExtension(keypoints),
      centerOfMass: this.calculateCenterOfMass(keypoints),
      stability: this.calculateStability(keypoints)
    };

    return metrics;
  }

  // Calculate balance based on body alignment
  calculateBalance(keypoints) {
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { score: 0, details: 'Insufficient keypoints for balance analysis' };
    }

    // Calculate shoulder and hip alignment
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    const hipAlignment = Math.abs(leftHip.y - rightHip.y);
    
    // Good balance = minimal difference in alignment
    const alignmentScore = Math.max(0, 100 - (shoulderAlignment + hipAlignment) * 2);
    
    return {
      score: Math.round(alignmentScore),
      shoulderAlignment: shoulderAlignment,
      hipAlignment: hipAlignment,
      details: alignmentScore > 80 ? 'Excellent balance' : 
               alignmentScore > 60 ? 'Good balance' : 'Needs improvement'
    };
  }

  // Analyze overall posture
  analyzePosture(keypoints) {
    const nose = keypoints.find(kp => kp.name === 'nose');
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');

    if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { score: 0, details: 'Insufficient keypoints for posture analysis' };
    }

    // Calculate spine alignment
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    // Calculate spine straightness
    const spineAngle = Math.abs(Math.atan2(
      shoulderCenter.x - hipCenter.x,
      shoulderCenter.y - hipCenter.y
    ) * 180 / Math.PI - 90);

    const postureScore = Math.max(0, 100 - spineAngle * 3);

    return {
      score: Math.round(postureScore),
      spineAngle: spineAngle,
      headPosition: nose.y < shoulderCenter.y ? 'upright' : 'forward',
      details: postureScore > 85 ? 'Excellent posture' :
               postureScore > 70 ? 'Good posture' : 'Posture needs improvement'
    };
  }

  // Analyze arm position and grace
  analyzeArmPosition(keypoints) {
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftElbow = keypoints.find(kp => kp.name === 'left_elbow');
    const rightElbow = keypoints.find(kp => kp.name === 'right_elbow');
    const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
    const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
      return { score: 0, details: 'Insufficient keypoints for arm analysis' };
    }

    // Calculate arm extension and positioning
    const leftArmExtension = this.calculateDistance(leftShoulder, leftWrist);
    const rightArmExtension = this.calculateDistance(rightShoulder, rightWrist);
    
    // Calculate symmetry
    const armSymmetry = Math.abs(leftArmExtension - rightArmExtension);
    const symmetryScore = Math.max(0, 100 - armSymmetry * 10);

    // Calculate graceful positioning (arms should be extended, not cramped)
    const avgExtension = (leftArmExtension + rightArmExtension) / 2;
    const extensionScore = Math.min(100, avgExtension * 2);

    const overallScore = (symmetryScore + extensionScore) / 2;

    return {
      score: Math.round(overallScore),
      leftExtension: leftArmExtension,
      rightExtension: rightArmExtension,
      symmetry: symmetryScore,
      details: overallScore > 80 ? 'Beautiful arm positioning' :
               overallScore > 60 ? 'Good arm position' : 'Arm position needs work'
    };
  }

  // Analyze leg extension and positioning
  analyzeLegExtension(keypoints) {
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return { score: 0, details: 'Insufficient keypoints for leg analysis' };
    }

    // Calculate leg extension
    const leftLegExtension = this.calculateDistance(leftHip, leftAnkle);
    const rightLegExtension = this.calculateDistance(rightHip, rightAnkle);

    // Calculate knee bend (for spins and certain elements)
    const leftKneeBend = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeBend = this.calculateAngle(rightHip, rightKnee, rightAnkle);

    const avgExtension = (leftLegExtension + rightLegExtension) / 2;
    const extensionScore = Math.min(100, avgExtension * 1.5);

    return {
      score: Math.round(extensionScore),
      leftExtension: leftLegExtension,
      rightExtension: rightLegExtension,
      leftKneeBend: leftKneeBend,
      rightKneeBend: rightKneeBend,
      details: extensionScore > 80 ? 'Excellent leg extension' :
               extensionScore > 60 ? 'Good leg extension' : 'Work on leg extension'
    };
  }

  // Calculate center of mass for stability analysis
  calculateCenterOfMass(keypoints) {
    const validKeypoints = keypoints.filter(kp => kp.score > 0.3);
    
    if (validKeypoints.length === 0) {
      return { x: 0, y: 0, stability: 0 };
    }

    const centerX = validKeypoints.reduce((sum, kp) => sum + kp.x, 0) / validKeypoints.length;
    const centerY = validKeypoints.reduce((sum, kp) => sum + kp.y, 0) / validKeypoints.length;

    return { x: centerX, y: centerY };
  }

  // Calculate stability based on pose confidence and alignment
  calculateStability(keypoints) {
    const avgConfidence = keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
    const stabilityScore = avgConfidence * 100;

    return {
      score: Math.round(stabilityScore),
      confidence: avgConfidence,
      details: stabilityScore > 80 ? 'Very stable pose' :
               stabilityScore > 60 ? 'Stable pose' : 'Unstable - check positioning'
    };
  }

  // Detect ice dance elements based on pose sequences
  detectElements(poseSequence) {
    if (poseSequence.length < 10) {
      return [];
    }

    const elements = [];

    // Detect twizzles (rapid rotation with consistent center)
    const twizzle = this.detectTwizzle(poseSequence);
    if (twizzle) elements.push(twizzle);

    // Detect lifts (significant height change)
    const lift = this.detectLift(poseSequence);
    if (lift) elements.push(lift);

    // Detect spins (rotation in place)
    const spin = this.detectSpin(poseSequence);
    if (spin) elements.push(spin);

    // Detect step sequences (complex footwork patterns)
    const stepSequence = this.detectStepSequence(poseSequence);
    if (stepSequence) elements.push(stepSequence);

    return elements;
  }

  // Detect twizzle element
  detectTwizzle(poseSequence) {
    // Look for rapid rotation with maintained center position
    const rotationChanges = [];
    
    for (let i = 1; i < poseSequence.length; i++) {
      const prev = poseSequence[i - 1];
      const curr = poseSequence[i];
      
      if (prev.analysis && curr.analysis) {
        const rotationChange = this.calculateRotationChange(prev.pose, curr.pose);
        rotationChanges.push(rotationChange);
      }
    }

    const avgRotation = rotationChanges.reduce((sum, r) => sum + Math.abs(r), 0) / rotationChanges.length;
    
    if (avgRotation > 5) { // Threshold for twizzle detection
      return {
        type: 'twizzle',
        startTime: poseSequence[0].timestamp,
        endTime: poseSequence[poseSequence.length - 1].timestamp,
        quality: this.calculateTwizzleQuality(poseSequence),
        confidence: 0.85
      };
    }

    return null;
  }

  // Detect lift element
  detectLift(poseSequence) {
    const heightChanges = [];
    
    for (let i = 1; i < poseSequence.length; i++) {
      const prev = poseSequence[i - 1];
      const curr = poseSequence[i];
      
      if (prev.analysis && curr.analysis) {
        const heightChange = curr.analysis.centerOfMass.y - prev.analysis.centerOfMass.y;
        heightChanges.push(heightChange);
      }
    }

    const maxHeightChange = Math.max(...heightChanges.map(Math.abs));
    
    if (maxHeightChange > 50) { // Threshold for lift detection
      return {
        type: 'lift',
        startTime: poseSequence[0].timestamp,
        endTime: poseSequence[poseSequence.length - 1].timestamp,
        height: maxHeightChange,
        confidence: 0.78
      };
    }

    return null;
  }

  // Calculate ISU-based scores
  calculateISUScore(element, analysis) {
    let baseValue = 0;
    let gradeOfExecution = 0;

    switch (element.type) {
      case 'twizzle':
        baseValue = 4.5; // Base value for Level 4 twizzles
        gradeOfExecution = this.calculateTwizzleGOE(analysis);
        break;
      case 'lift':
        baseValue = 5.0; // Base value for Level 3 lift
        gradeOfExecution = this.calculateLiftGOE(analysis);
        break;
      case 'spin':
        baseValue = 3.0; // Base value for Level 3 spin
        gradeOfExecution = this.calculateSpinGOE(analysis);
        break;
      case 'step_sequence':
        baseValue = 3.5; // Base value for Level 4 step sequence
        gradeOfExecution = this.calculateStepSequenceGOE(analysis);
        break;
      default:
        baseValue = 2.0;
        gradeOfExecution = 0;
    }

    return {
      baseValue: baseValue,
      gradeOfExecution: gradeOfExecution,
      totalScore: baseValue + gradeOfExecution,
      level: this.determineLevel(element, analysis)
    };
  }

  // Helper functions
  calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  calculateAngle(point1, point2, point3) {
    const vector1 = { x: point1.x - point2.x, y: point1.y - point2.y };
    const vector2 = { x: point3.x - point2.x, y: point3.y - point2.y };
    
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    return Math.acos(dotProduct / (magnitude1 * magnitude2)) * 180 / Math.PI;
  }

  calculateRotationChange(pose1, pose2) {
    // Simplified rotation calculation based on shoulder orientation
    const shoulder1 = this.getShoulderAngle(pose1);
    const shoulder2 = this.getShoulderAngle(pose2);
    return shoulder2 - shoulder1;
  }

  getShoulderAngle(pose) {
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');
    
    if (!leftShoulder || !rightShoulder) return 0;
    
    return Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * 180 / Math.PI;
  }

  calculateTwizzleQuality(poseSequence) {
    // Analyze rotation consistency and body position
    const balanceScores = poseSequence.map(frame => 
      frame.analysis ? frame.analysis.balance.score : 0
    );
    const avgBalance = balanceScores.reduce((sum, score) => sum + score, 0) / balanceScores.length;
    
    return {
      balance: avgBalance,
      consistency: this.calculateConsistency(balanceScores),
      overall: Math.round((avgBalance + this.calculateConsistency(balanceScores)) / 2)
    };
  }

  calculateConsistency(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  calculateTwizzleGOE(analysis) {
    // GOE ranges from -5 to +5
    const baseGOE = (analysis.overall - 70) / 10; // Convert 0-100 to GOE scale
    return Math.max(-5, Math.min(5, baseGOE));
  }

  calculateLiftGOE(analysis) {
    // Similar GOE calculation for lifts
    return Math.random() * 2 - 1; // Placeholder for actual lift analysis
  }

  calculateSpinGOE(analysis) {
    // Similar GOE calculation for spins
    return Math.random() * 2 - 1; // Placeholder for actual spin analysis
  }

  calculateStepSequenceGOE(analysis) {
    // Similar GOE calculation for step sequences
    return Math.random() * 2 - 1; // Placeholder for actual step sequence analysis
  }

  determineLevel(element, analysis) {
    // Simplified level determination
    if (analysis.overall > 90) return 'Level 4';
    if (analysis.overall > 75) return 'Level 3';
    if (analysis.overall > 60) return 'Level 2';
    return 'Level 1';
  }

  // Public method to analyze complete video
  async analyzeVideo(videoElement, onProgress = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const results = {
      elements: [],
      overallAnalysis: null,
      frameAnalyses: []
    };

    // For demo purposes, analyze a few frames
    // In production, you'd analyze the entire video systematically
    const sampleInterval = 1000; // Analyze every second
    const videoDuration = videoElement.duration * 1000;
    
    for (let time = 0; time < videoDuration; time += sampleInterval) {
      if (onProgress) {
        onProgress((time / videoDuration) * 100);
      }

      videoElement.currentTime = time / 1000;
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for seek

      const frameAnalysis = await this.analyzeFrame(videoElement);
      if (frameAnalysis) {
        results.frameAnalyses.push(frameAnalysis);
      }
    }

    // Detect elements from frame sequence
    results.elements = this.detectElements(results.frameAnalyses);
    
    // Calculate overall performance metrics
    results.overallAnalysis = this.calculateOverallAnalysis(results.frameAnalyses);

    return results;
  }

  calculateOverallAnalysis(frameAnalyses) {
    if (frameAnalyses.length === 0) {
      return null;
    }

    const avgBalance = frameAnalyses.reduce((sum, frame) => 
      sum + (frame.analysis?.balance?.score || 0), 0) / frameAnalyses.length;
    
    const avgPosture = frameAnalyses.reduce((sum, frame) => 
      sum + (frame.analysis?.posture?.score || 0), 0) / frameAnalyses.length;
    
    const avgStability = frameAnalyses.reduce((sum, frame) => 
      sum + (frame.analysis?.stability?.score || 0), 0) / frameAnalyses.length;

    return {
      balance: Math.round(avgBalance),
      posture: Math.round(avgPosture),
      stability: Math.round(avgStability),
      overall: Math.round((avgBalance + avgPosture + avgStability) / 3)
    };
  }
}

// Export singleton instance
export default new AIAnalysisService();